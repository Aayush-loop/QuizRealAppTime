const Quiz = require('../models/quiz.model');
const Result = require('../models/result.model');

const quizStudents = {};
module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('New socket connected:', socket.id);

        // Instructor joins their quiz room to receive updates
        socket.on('joinInstructorRoom', (quizId) => {
            socket.join(`instructor-${quizId}`);
            console.log(`Instructor joined room: instructor-${quizId}`);
        });

        // Student joins quiz
        socket.on('joinQuiz', (user) => {
            const quizId = user.quizId;
            console.log('User joined quiz:', user);

            // Initialize quizId entry if needed
            if (!quizStudents[quizId]) {
                quizStudents[quizId] = [];
            }

            // Check if student already joined
            const alreadyJoined = quizStudents[quizId].some(u => u.id === user.id);
            if (!alreadyJoined) {
                quizStudents[quizId].push(user);
            }

            // Broadcast to instructor
            io.to(`instructor-${quizId}`).emit('studentListUpdated', quizStudents[quizId]);

            // Acknowledge user
            socket.emit('userJoined', {
                message: `${user?.name} has joined the quiz`,
                user: user,
            });

            // Attach user metadata to socket for tracking on disconnect
            socket.quizId = quizId;
            socket.userId = user.id;
        });

        socket.on('startQuiz', (quizId) => {
            console.log(`Quiz ${quizId} started`);
            socket.broadcast.emit('startQuiz', {
                message: 'Quiz started',
                started: true,
            });
        });

        // Admin/instructor changes the question
        socket.on('admin-question-change', (question) => {
            console.log('Question changed by admin:', question);
            socket.broadcast.emit('update-question', question);
        });

        socket.on('submitAnswer', async (payload) => {
            console.log('User submitted answer:', payload);
            const { quizId, userId, questionId, options, timeTaken } = payload;

            try {
                const existingResult = await Result.findOne({ quiz: quizId, user: userId });

                if (existingResult) {
                    existingResult.submission.push({
                        question: questionId,
                        timeTaken: timeTaken,
                        submittedAnswer: options,
                    });
                    await existingResult.save();
                } else {
                    await Result.create({
                        quiz: quizId,
                        user: userId,
                        submission: [
                            {
                                question: questionId,
                                timeTaken: timeTaken,
                                submittedAnswer: options,
                            },
                        ]
                    });
                }
            } catch (err) {
                console.error("Error saving result:", err);
                socket.emit("error", { message: "Failed to save your answer." });
            }
        });



        // End quiz
        socket.on('endQuiz', () => {
            console.log('Quiz ended by instructor');
            socket.broadcast.emit('endQuiz', {
                message: 'Quiz ended',
                ended: true,
            });
        });

        // Handle disconnect
        socket.on('disconnect', () => {
            const quizId = socket.quizId;
            const userId = socket.userId;

            if (quizId && quizStudents[quizId]) {
                // Remove user from student list
                quizStudents[quizId] = quizStudents[quizId].filter(u => u.id !== userId);

                // Broadcast updated list
                io.to(`instructor-${quizId}`).emit('studentListUpdated', quizStudents[quizId]);

                console.log(`User ${userId} disconnected from quiz ${quizId}`);
            }
        });
    });
};

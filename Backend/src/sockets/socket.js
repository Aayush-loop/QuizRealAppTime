const Quiz = require('../models/quiz.model');
const Result = require('../models/result.model');

const quizStudents = {};
module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('New socket connected:', socket.id);

        socket.on('joinInstructorRoom', (quizId) => {
            socket.join(`instructor-${quizId}`);
            console.log(`Instructor joined room: instructor-${quizId}`);
        });


        socket.on('joinQuiz', (user) => {
            const quizId = user.quizId;
            // console.log('User joined quiz:', user);
            if (!quizStudents[quizId]) {
                quizStudents[quizId] = [];
            }

            // Check if student already joined
            const alreadyJoined = quizStudents[quizId].some(u => u.id === user.id);
            if (!alreadyJoined) {
                quizStudents[quizId].push(user);
            }

            io.to(`instructor-${quizId}`).emit('studentListUpdated', quizStudents[quizId]);

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
            //  console.log('Question changed by admin:', question);
            socket.broadcast.emit('update-question', question);
        });
        socket.on('submitAnswer', async (payload) => {
            console.log('Answer submitted:', payload);
            const { quizId, userId, questionId, options, timeTaken } = payload;

            try {
                // Save the user's submission
                const existingResult = await Result.findOne({ quiz: quizId, user: userId });

                if (existingResult) {
                    existingResult.submission.push({
                        question: questionId,
                        timeTaken,
                        submittedAnswer: options,
                    });
                    await existingResult.save();
                } else {
                    await Result.create({
                        quiz: quizId,
                        user: userId,
                        submission: [{
                            question: questionId,
                            timeTaken,
                            submittedAnswer: options,
                        }]
                    });
                }

                // Get correct answers for the question
                const quiz = await Quiz.findById(quizId).populate('questions');
                const questionMap = {};
                quiz.questions.forEach(q => {
                    questionMap[q._id.toString()] = q;
                });

                const targetQuestion = questionMap[questionId];
                if (!targetQuestion) return;

                const correctAnswers = targetQuestion.options
                    .filter(o => o.isCorrect)
                    .map(o => o._id.toString());


                const allResults = await Result.find({ quiz: quizId });
                let submitted = 0, correct = 0, wrong = 0;

                allResults.forEach(result => {
                    result.submission.forEach(sub => {
                        if (sub.question.toString() === questionId) {
                            submitted++;
                            const submittedAns = sub.submittedAnswer.map(a => a.toString());
                            const isCorrect = submittedAns.length === correctAnswers.length &&
                                submittedAns.every(a => correctAnswers.includes(a));
                            isCorrect ? correct++ : wrong++;
                        }
                    });
                });

                console.log('Stats:', { submitted, correct, wrong });

                // Emit updated stats to instructor
                console.log(`instructor-${quizId}`);
                // io.to(`instructor-${quizId}`).emit('answerStatsUpdated', {
                //     questionId,
                //     submitted,
                //     correct,
                //     wrong
                // });

                io.emit('answerStatsUpdated', {
                    questionId,
                    submitted,
                    correct,
                    wrong
                });


            } catch (err) {
                console.error("Error saving result:", err);
                socket.emit("error", { message: "Failed to save your answer." });
            }
        });


        socket.on('endQuiz', async ({ quizId }) => {
            console.log('Quiz ended by instructor');

            await Quiz.findByIdAndUpdate(quizId, {
                status: 'completed',
            });

            const quiz = await Quiz.findById(quizId);
            if (!quiz) {
                return res.status(404).json(new apiResponse(404, "Quiz not found", null));
            }

            const fullMarks = quiz.fullMarks;
            const questionMap = {};
            quiz.questions.forEach(q => {
                questionMap[q._id.toString()] = q;
            });

            const results = await Result.find({ quiz: quizId })
                .populate({ path: 'user', select: 'name email profileImage' });

            const leaderboard = results.map(r => {
                const totalScore = r.submission.reduce((sum, s) => {
                    const q = questionMap[s.question.toString()];
                    if (!q) return sum;

                    const correctAnswers = q.options.filter(opt => opt.isCorrect).map(opt => opt._id.toString());
                    const submitted = s.submittedAnswer.map(id => id.toString());

                    const isCorrect = submitted.length === correctAnswers.length &&
                        submitted.every(ans => correctAnswers.includes(ans));

                    return sum + (isCorrect ? q.marks : 0);
                }, 0);

                const percent = Math.round((totalScore / fullMarks) * 100);

                return {
                    resultId: r._id,
                    userId: r.user._id,
                    name: r.user.name,
                    email: r.user.email,
                    profileImage: r.user.profileImage || '/images/avatar.jpg',
                    score: `${totalScore}/${fullMarks}`,
                    percentage: percent,
                    rawScore: totalScore
                };
            });

            // Sort by score descending
            leaderboard.sort((a, b) => b.rawScore - a.rawScore);

            // Add rank
            leaderboard.forEach((user, index) => {
                user.rank = `${index + 1}/${leaderboard.length}`;
                delete user.rawScore;
            });

            console.log('Leaderboard:', leaderboard);


            socket.broadcast.emit('getLeaderBoard', {
                message: 'Quiz ended',
                ended: true,
                data: leaderboard,
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

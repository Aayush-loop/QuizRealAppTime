// const Quiz = require('../models/quiz.model');
// const Result = require('../models/result.model');

// const quizStudents = {};

// module.exports = (io) => {
//     io.on('connection', (socket) => {
//         console.log('New socket connected:', socket.id);

//         socket.on('joinQuiz', (user) => {
//             console.log('User joined quiz:', user);
//             const quizId = user.quizId;
//             socket.quizId = quizId;
//             socket.userId = user._id;


//             if (!quizStudents[quizId]) quizStudents[quizId] = [];

//             const alreadyJoined = quizStudents[quizId].some(u => u._id === user._id);
//             if (!alreadyJoined) {
//                 quizStudents[quizId].push(user);
//             }

//             io.emit('studentListUpdated', quizStudents[quizId]);

//         });

//         socket.on('startQuiz', (quizId) => {
//             console.log(`Quiz ${quizId} started`);

//             io.emit('startQuiz', {
//                 message: 'Quiz started',
//                 started: true,
//             });
//         });

//         socket.on('admin-question-change', (question) => {

//             io.emit('update-question', question);
//         });

//         socket.on('submitAnswer', async (payload) => {
//             const { quizId, userId, questionId, options, timeTaken } = payload;
//             console.log('Answer submitted:', payload);

//             try {
//                 const quiz = await Quiz.findById(quizId).populate('questions');

//                 const questionMap = {};
//                 quiz.questions.forEach(q => {
//                     questionMap[q._id.toString()] = q;
//                 });

//                 const targetQuestion = questionMap[questionId];
//                 if (!targetQuestion) return;

//                 const correctAnswers = targetQuestion.options.filter(o => o.isCorrect).map(o => o._id.toString());
//                 const submittedAns = options.map(a => a.toString());
//                 const isCorrect = submittedAns.length === correctAnswers.length &&
//                     submittedAns.every(a => correctAnswers.includes(a));

//                 let obtainedMarks = 0;
//                 if (isCorrect) {
//                     const timeFactor = 1 / (1 + Math.log(timeTaken + 1));
//                     obtainedMarks = parseFloat((targetQuestion.marks * timeFactor).toFixed(2));
//                 }

//                 const newSubmission = {
//                     question: questionId,
//                     timeTaken,
//                     submittedAnswer: options,
//                     obtainedMarks
//                 };

//                 const existingResult = await Result.findOne({ quiz: quizId, user: userId });
//                 if (existingResult) {
//                     existingResult.submission.push(newSubmission);
//                     await existingResult.save();
//                 } else {
//                     await Result.create({ quiz: quizId, user: userId, submission: [newSubmission] });
//                 }

//                 const allResults = await Result.find({ quiz: quizId });
//                 let submitted = 0, correct = 0, wrong = 0;

//                 allResults.forEach(result => {
//                     result.submission.forEach(sub => {
//                         if (sub.question.toString() === questionId) {
//                             submitted++;
//                             sub.obtainedMarks > 0 ? correct++ : wrong++;
//                         }
//                     });
//                 });
//                 io.emit('answerStatsUpdated', { questionId, submitted, correct, wrong });

//             } catch (err) {
//                 console.error("Error saving result:", err);
//                 socket.emit("error", { message: "Failed to save your answer." });
//             }
//         });

//         socket.on('endQuiz', async ({ quizId }) => {
//             console.log('Quiz ended:', quizId);
//             await Quiz.findByIdAndUpdate(quizId, { status: 'completed' });

//             const quiz = await Quiz.findById(quizId);
//             if (!quiz) return;

//             const fullMarks = quiz.fullMarks;

//             const results = await Result.find({ quiz: quizId })
//                 .populate({ path: 'user', select: 'name email profileImage' });

//             const leaderboard = results.map(r => {
//                 const totalScore = r.submission.reduce((sum, s) => sum + (s.obtainedMarks || 0), 0);
//                 const percent = Math.round((totalScore / fullMarks) * 100);

//                 return {
//                     resultId: r._id,
//                     userId: r.user._id,
//                     name: r.user.name,
//                     email: r.user.email,
//                     profileImage: r.user.profileImage || '/images/avatar.jpg',
//                     score: `${totalScore}/${fullMarks}`,
//                     percentage: percent,
//                     rawScore: totalScore
//                 };
//             });

//             leaderboard.sort((a, b) => b.rawScore - a.rawScore);
//             leaderboard.forEach((user, index) => {
//                 user.rank = `${index + 1}/${leaderboard.length}`;
//                 delete user.rawScore;
//             });


//             io.emit('getLeaderBoard', {
//                 message: 'Quiz ended',
//                 ended: true,
//                 data: leaderboard,
//             });
//         });

//         socket.on('disconnect', () => {
//             const quizId = socket.quizId;
//             const userId = socket.userId;

//             if (quizId && quizStudents[quizId]) {
//                 quizStudents[quizId] = quizStudents[quizId].filter(u => u._id !== userId);
//                 io.emit('studentListUpdated', quizStudents[quizId]);
//                 console.log(`User ${userId} disconnected from quiz ${quizId}`);
//             }
//         });
//     });
// };

const Quiz = require('../models/quiz.model');
const Result = require('../models/result.model');

const quizStudents = {};

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('New socket connected:', socket.id);

        socket.on('joinQuiz', (user) => {
            console.log('User joined quiz:', user);
            const quizId = user.quizId;
            socket.quizId = quizId;
            socket.userId = user._id;

            socket.join(quizId);

            if (!quizStudents[quizId]) quizStudents[quizId] = [];

            const alreadyJoined = quizStudents[quizId].some(u => u._id === user._id);
            if (!alreadyJoined) {
                quizStudents[quizId].push(user);
            }

            console.log('Current students in quiz:', quizStudents[quizId]);

            io.to(quizId).emit('studentListUpdated', quizStudents[quizId]);
        });


        socket.on('startQuiz', ({ quizId }) => {
            console.log(`Quiz ${quizId} started`);
            io.to(quizId).emit('startQuiz', {
                message: 'Quiz started',
                started: true,
            });
        });

        socket.on('admin-question-change', (payload) => {
            const { question, questionIndex, totalQuestions } = payload;
            const quizId = socket.quizId;

            if (quizId) {
                io.to(quizId).emit('update-question', { question, questionIndex, totalQuestions });
            }
        });

        socket.on('submitAnswer', async (payload) => {
            const { quizId, userId, questionId, options, timeTaken } = payload;

            try {
                const quiz = await Quiz.findById(quizId).populate('questions');

                const questionMap = {};
                quiz.questions.forEach(q => {
                    questionMap[q._id.toString()] = q;
                });

                const targetQuestion = questionMap[questionId];
                if (!targetQuestion) return;

                const correctAnswers = targetQuestion.options.filter(o => o.isCorrect).map(o => o._id.toString());
                const submittedAns = options.map(a => a.toString());
                const isCorrect = submittedAns.length === correctAnswers.length &&
                    submittedAns.every(a => correctAnswers.includes(a));

                let obtainedMarks = 0;
                if (isCorrect) {
                    const timeFactor = 1 / (1 + Math.log(timeTaken + 1));
                    obtainedMarks = parseFloat((targetQuestion.marks * timeFactor).toFixed(2));
                }

                const newSubmission = {
                    question: questionId,
                    timeTaken,
                    submittedAnswer: options,
                    obtainedMarks
                };

                const existingResult = await Result.findOne({ quiz: quizId, user: userId });
                if (existingResult) {
                    const alreadySubmitted = existingResult.submission.some(sub => sub.question.toString() === questionId);
                    if (!alreadySubmitted) {
                        existingResult.submission.push(newSubmission);
                        await existingResult.save();
                    }
                } else {
                    await Result.create({ quiz: quizId, user: userId, submission: [newSubmission] });
                }

                const allResults = await Result.find({ quiz: quizId });
                let submitted = 0, correct = 0, wrong = 0;

                allResults.forEach(result => {
                    result.submission.forEach(sub => {
                        if (sub.question.toString() === questionId) {
                            submitted++;
                            sub.obtainedMarks > 0 ? correct++ : wrong++;
                        }
                    });
                });

                io.to(quizId).emit('answerStatsUpdated', { questionId, submitted, correct, wrong });

            } catch (err) {
                console.error("Error saving result:", err);
                socket.emit("error", { message: "Failed to save your answer." });
            }
        });

        socket.on('endQuiz', async ({ quizId }) => {
            console.log('Quiz ended:', quizId);
            await Quiz.findByIdAndUpdate(quizId, { status: 'completed' });

            const quiz = await Quiz.findById(quizId);
            if (!quiz) return;

            const fullMarks = quiz.fullMarks;
            const results = await Result.find({ quiz: quizId }).populate('user', 'name email profileImage');

            const leaderboard = results.map(r => {
                const totalScore = r.submission.reduce((sum, s) => sum + (s.obtainedMarks || 0), 0);
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

            leaderboard.sort((a, b) => b.rawScore - a.rawScore);
            leaderboard.forEach((user, index) => {
                user.rank = `${index + 1}/${leaderboard.length}`;
                delete user.rawScore;
            });

            io.to(quizId).emit('getLeaderBoard', {
                message: 'Quiz ended',
                ended: true,
                data: leaderboard,
            });

            delete quizStudents[quizId]; // ✅ clear memory
        });

        // 🟢 DISCONNECT
        socket.on('disconnect', () => {
            const quizId = socket.quizId;
            const userId = socket.userId;

            if (quizId && quizStudents[quizId]) {
                quizStudents[quizId] = quizStudents[quizId].filter(u => u._id !== userId);
                io.to(quizId).emit('studentListUpdated', quizStudents[quizId]);
                console.log(`User ${userId} disconnected from quiz ${quizId}`);
            }
        });
    });
};



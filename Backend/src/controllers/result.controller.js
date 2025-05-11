const Result = require('../models/result.model');
const apiResponse = require('../utils/apiResponse');
const Quiz = require('../models/quiz.model');


const getResult = async (req, res) => {
    try {

        const resultId = req.params.resultId || req.query.resultId;
        const userId = (req.user && req.user.role === "instructor") ? req.query.userId : req.user.id;


        const query = { user: userId };
        if (resultId) {
            query._id = resultId;
        }

        const allResults = await Result.find(query)
            .populate([
                { path: 'user', select: 'name email profileImage' },
                { path: 'quiz', select: 'title description questions' }
            ]);

        const formattedResults = allResults.map(result => {
            let correct = 0, wrong = 0;

            const questionMap = {};
            result.quiz.questions.forEach(q => {
                questionMap[q._id.toString()] = q;
            });

            const submissions = result.submission.map((entry, index) => {
                const q = questionMap[entry.question.toString()];
                if (!q) return null;

                const correctAnswers = q.options
                    .filter(opt => opt.isCorrect)
                    .map(opt => opt._id.toString());

                const submitted = entry.submittedAnswer.map(a => a.toString());

                const isCorrect =
                    submitted.length === correctAnswers.length &&
                    submitted.every(ans => correctAnswers.includes(ans));

                let status = "unattempted";
                if (submitted.length > 0) {
                    status = isCorrect ? "correct" : "wrong";
                    if (isCorrect) correct++;
                    else wrong++;
                }

                return {
                    qNo: index + 1,
                    question: q.question,
                    marks: q.marks,
                    options: q.options.map(opt => ({ id: opt._id.toString(), text: opt.option })),
                    selected: submitted,
                    correctAnswers,
                    status,
                    timeTaken: entry.timeTaken,
                };
            }).filter(Boolean);
            return {
                resultId: result._id,
                quizTitle: result.quiz.title,
                quizDescription: result.quiz.description,
                attempted: submissions.filter(s => s.status !== "unattempted").length,
                correct,
                wrong,
                statusArray: submissions.map((s, i) => ({ qNo: i + 1, status: s.status })),
                submissions,
            };
        });

        res.status(200).json(new apiResponse(200, "Results fetched successfully", formattedResults));

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: error.message,
            success: false,
        });
    }
};

const getMyLeaderBoard = async (req, res) => {
    const userId = req.user.id;

    try {
        const results = await Result.find({ user: userId })
            .populate({ path: 'quiz', select: 'title fullMarks questions' });

        const data = await Promise.all(results.map(async (r) => {
            const quiz = r.quiz;
            const totalUsers = await Result.countDocuments({ quiz: quiz._id });


            const questionMap = {};
            quiz.questions.forEach(q => {
                questionMap[q._id.toString()] = q;
            });


            const userScore = r.submission.reduce((acc, s) => {
                const q = questionMap[s.question.toString()];
                if (!q) return acc;

                const correctAnswers = q.options.filter(o => o.isCorrect).map(o => o._id.toString());
                const submitted = s.submittedAnswer.map(id => id.toString());

                const isCorrect = correctAnswers.length === submitted.length &&
                    submitted.every(ans => correctAnswers.includes(ans));

                return acc + (isCorrect ? q.marks : 0);
            }, 0);


            const allScores = await Result.find({ quiz: quiz._id }).select('user submission');
            const rankedList = allScores.map(rs => {
                const score = rs.submission.reduce((total, sub) => {
                    const q = questionMap[sub.question.toString()];
                    if (!q) return total;

                    const correctAnswers = q.options.filter(o => o.isCorrect).map(o => o._id.toString());
                    const submitted = sub.submittedAnswer.map(id => id.toString());

                    const isCorrect = correctAnswers.length === submitted.length &&
                        submitted.every(ans => correctAnswers.includes(ans));

                    return total + (isCorrect ? q.marks : 0);
                }, 0);

                return { id: rs.user.toString(), score };
            }).sort((a, b) => b.score - a.score);

            const rank = rankedList.findIndex(r => r.id === userId.toString()) + 1;

            return {
                quizTitle: quiz.title,
                score: `${userScore}/${quiz.fullMarks}`,
                rank: `${rank}/${totalUsers}`,
                resultId: r._id,
                quizId: quiz._id,
            };
        }));
        res.status(200).json(new apiResponse(200, "Leaderboard fetched successfully", data));

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: error.message,
            success: false,
        });
    }
};


const overallLeaderboard = async (req, res) => {
    try {
        const allResults = await Result.find()
            .populate([
                { path: 'user', select: 'name email profileImage' },
                { path: 'quiz', select: 'fullMarks' }
            ]);

        const userScores = {};

        allResults.forEach(result => {
            const userId = result.user._id.toString();
            const fullMarks = result.quiz?.fullMarks || 100; // default fallback
            const score = result.submission.reduce((sum, s) => sum + (s.marksEarned || 0), 0);

            if (!userScores[userId]) {
                userScores[userId] = {
                    name: result.user.name,
                    email: result.user.email,
                    profileImage: result.user.profileImage,
                    score,
                    totalPossible: fullMarks,
                };
            } else {
                userScores[userId].score += score;
                userScores[userId].totalPossible += fullMarks;
            }
        });

        const leaderboard = Object.values(userScores)
            .map(user => ({
                name: user.name,
                email: user.email,
                profileImage: user.profileImage,
                percentage: user.totalPossible === 0 ? 0 : Math.round((user.score / user.totalPossible) * 100),
            }))
            .sort((a, b) => b.percentage - a.percentage)
            .slice(0, 5); // Top 5

        res.status(200).json(new apiResponse(200, "Leaderboard fetched successfully", leaderboard));
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: error.message,
            success: false,
        });
    }
};

const getQuizLeaderboard = async (req, res) => {
    try {
        const { quizId } = req.params;

        // Get quiz to know full marks and questions
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json(new apiResponse(404, "Quiz not found", null));
        }

        const fullMarks = quiz.fullMarks;
        const questionMap = {};
        quiz.questions.forEach(q => {
            questionMap[q._id.toString()] = q;
        });

        // Get all results for this quiz with user info
        const results = await Result.find({ quiz: quizId })
            .populate({ path: 'user', select: 'name email profileImage' });

        // Calculate scores
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

        res.status(200).json(new apiResponse(200, "Leaderboard fetched successfully", leaderboard));

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    getResult,
    getMyLeaderBoard,
    overallLeaderboard,
    getQuizLeaderboard
};

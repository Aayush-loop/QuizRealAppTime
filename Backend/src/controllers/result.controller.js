const Result = require('../models/result.model');
const apiResponse = require('../utils/apiResponse');
const Quiz = require('../models/quiz.model');
const mongoose = require('mongoose');

const getResult = async (req, res) => {
    try {
        const resultId = req.params.resultId || req.query.resultId;
        const userId = (req.user && req.user.role === "instructor") ? req.query.userId : req.user.id;

        const query = { user: userId };
        if (resultId) query._id = resultId;

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

                const submitted = entry.submittedAnswer.map(a => a.toString());
                const obtainedMarks = entry.obtainedMarks || 0;

                let status = "unattempted";
                if (submitted.length > 0) {
                    status = obtainedMarks > 0 ? "correct" : "wrong";
                    if (obtainedMarks > 0) correct++;
                    else wrong++;
                }

                return {
                    qNo: index + 1,
                    question: q.question,
                    marks: q.marks,
                    obtainedMarks,
                    options: q.options.map(opt => ({ id: opt._id.toString(), text: opt.option })),
                    selected: submitted,
                    correctAnswers: q.options.filter(opt => opt.isCorrect).map(opt => opt._id.toString()),
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
        res.status(500).json({ message: error.message, success: false });
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

            const userScore = r.submission.reduce((acc, s) => acc + (s.obtainedMarks || 0), 0);

            const allScores = await Result.find({ quiz: quiz._id }).select('user submission');
            const rankedList = allScores.map(rs => {
                const score = rs.submission.reduce((total, sub) => total + (sub.obtainedMarks || 0), 0);
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
        res.status(500).json({ message: error.message, success: false });
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
            const fullMarks = result.quiz?.fullMarks || 100;
            const score = result.submission.reduce((sum, s) => sum + (s.obtainedMarks || 0), 0);

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
            .slice(0, 5);

        res.status(200).json(new apiResponse(200, "Leaderboard fetched successfully", leaderboard));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message, success: false });
    }
};

const getQuizLeaderboard = async (req, res) => {
    try {
        const { quizId } = req.params;
        const quiz = await Quiz.findById(quizId);
        if (!quiz) return res.status(404).json(new apiResponse(404, "Quiz not found", null));

        const fullMarks = quiz.fullMarks;

        const results = await Result.find({ quiz: quizId })
            .populate({ path: 'user', select: 'name email profileImage' });

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

        res.status(200).json(new apiResponse(200, "Leaderboard fetched successfully", leaderboard));
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};



const dashboard = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.id);

        const stats = await Result.aggregate([
            { $match: { user: userId } },
            { $unwind: '$submission' },
            {
                $group: {
                    _id: null,
                    attempted: { $sum: 1 },
                    correct: {
                        $sum: {
                            $cond: [{ $gt: ['$submission.obtainedMarks', 0] }, 1, 0]
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    attempted: 1,
                    correct: 1,
                    incorrect: { $subtract: ['$attempted', '$correct'] }
                }
            }
        ]);

        const summary = stats[0] || { attempted: 0, correct: 0, incorrect: 0 };
        res.status(200).json(new apiResponse(200, "Dashboard summary fetched successfully", summary));
    } catch (error) {
        console.error('Dashboard summary error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


module.exports = {
    getResult,
    getMyLeaderBoard,
    overallLeaderboard,
    getQuizLeaderboard,
    dashboard
};

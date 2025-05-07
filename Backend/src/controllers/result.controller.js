const Result = require('../models/result.model');
const Quiz = require('../models/quiz.model');
const apiResponse = require('../utils/apiResponse');


const getResult = async (req, res) => {
    try {
        const userId = req.user.id;
        const resultId = req.params.resultId || req.query.resultId;

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

module.exports = { getResult };

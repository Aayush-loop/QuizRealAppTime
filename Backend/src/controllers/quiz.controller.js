const Quiz = require('../models/quiz.model');
const apiResponse = require('../utils/apiResponse');
const apiError = require('../utils/apiError');
const uploadFileToCloudinary = require('../middlewares/cloudinary.middleware');
const objectIdRegex = /^[a-fA-F0-9]{24}$/;
const addQuiz = async (req, res) => {
    try {
        const { title, description, date, time, fullMarks, passMarks, duration, numberOfQuestions, topic } = req.body;

        if ([title, description, date, time, fullMarks, passMarks, duration, numberOfQuestions, topic].some((field) => {
            return !field || field.trim() === ""
        })) {
            throw new apiError(400, "All the fields are required")
        }

        const quiz = await Quiz.create({
            title,
            description,
            date,
            time,
            fullMarks,
            passMarks,
            duration,
            numberOfQuestions,
            topic,
            bannerImage: req.file ? await uploadFileToCloudinary(req.file.path) : null
        })

        res.status(201).json(new apiResponse(201, "Quiz created successfully", quiz));

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message,
            success: false,
        });

    }
}

const addQuestion = async (req, res) => {
    try {
        const quizId = req.params.id;

        if (!quizId || objectIdRegex.test(quizId)) {
            throw new apiError(400, "Invalid or Missing Quiz ID")
        }

        const { questions } = req.body;
        if (!questions || questions.length === 0) {
            throw new apiError(400, "Questions are required")
        }
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            throw new apiError(404, "Quiz not found")
        }
        if (quiz.questions.length >= quiz.numberOfQuestions) {
            throw new apiError(400, "Quiz already has maximum number of questions")
        }

        const questionPromises = questions.map(async (question) => {
            const { question: questionText, options, difficulty, marks } = question;
            if ([questionText, options, difficulty, marks].some((field) => {
                return !field || field.trim() === ""
            })) {
                throw new apiError(400, "All the fields are required")
            }
            const imageUrl = req.file ? await uploadFileToCloudinary(req.file.path) : null;
            return {
                question: questionText,
                options,
                difficulty,
                marks,
                image: imageUrl
            };
        });

        const questionAnswers = await Promise.all(questionPromises);

        quiz.questions.push(...questionAnswers);
        await quiz.save();

        res.status(201).json(new apiResponse(201, "Questions added successfully", quiz));

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message,
            success: false,
        });

    }
}
module.exports = {
    addQuiz,
    addQuestion
}
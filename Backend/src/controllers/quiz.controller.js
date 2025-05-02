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
        const quizId = req.params.quizId;
        // console.log(quizId);

        if (!quizId || !objectIdRegex.test(quizId)) {
            throw new apiError(400, "Invalid or Missing Quiz ID");
        }

        let { questions } = req.body;
        if (!questions) {
            throw new apiError(400, "Questions are required");
        }

        questions = JSON.parse(questions);

        if (!Array.isArray(questions) || questions.length === 0) {
            throw new apiError(400, "Questions should be a non-empty array");
        }

        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            throw new apiError(404, "Quiz not found");
        }

        if (quiz.questions.length >= quiz.numberOfQuestions) {
            throw new apiError(400, "Quiz already has maximum number of questions");
        }

        const files = req.files || [];

        const questionPromises = questions.map(async (question, index) => {
            const { question: questionText, options, difficulty, marks } = question;

            if ([questionText, options, difficulty, marks].some((field) => !field || field === "")) {
                throw new apiError(400, "All the fields are required");
            }

            const imageFile = files[index];
            const imageUrl = imageFile ? await uploadFileToCloudinary(imageFile.path) : null;

            return {
                question: questionText,
                options,
                difficulty,
                marks,
                image: imageUrl,
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
};

const getQuizById = async (req, res) => {
    try {
        const quizId = req.params.quizId;
        if (!quizId || !objectIdRegex.test(quizId)) {
            throw new apiError(400, "Invalid or Missing Quiz ID");
        }

        const quiz = await Quiz.findById(quizId).populate('questions.question').populate('topic');
        if (!quiz) {
            throw new apiError(404, "Quiz not found");
        }

        res.status(200).json(new apiResponse(200, "Quiz fetched successfully", quiz));

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message,
            success: false,
        });

    }
}

const getQuestion = async (req, res) => {
    try {
        const quizId = req.params.quizId;
        const { questionIndex } = req.query;
        if (!quizId || !objectIdRegex.test(quizId)) {
            throw new apiError(400, "Invalid or Missing Quiz ID");
        }
        if (!questionIndex || isNaN(questionIndex)) {
            throw new apiError(400, "Invalid or Missing Question Index");
        }

        const quiz = await Quiz.findById(quizId).populate('questions.question').populate('topic');
        if (!quiz) {
            throw new apiError(404, "Quiz not found");
        }
        if (questionIndex < 0 || questionIndex >= quiz.questions.length) {
            throw new apiError(400, "Question index out of bounds");
        }
        const question = quiz.questions[questionIndex];
        if (!question) {
            throw new apiError(404, "Question not found");
        }
        res.status(200).json(new apiResponse(200, "Question fetched successfully", {
            question,
            length: quiz.questions.length,
        }));

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
    addQuestion,
    getQuizById,
    getQuestion
}
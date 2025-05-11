const Quiz = require('../models/quiz.model');
const apiResponse = require('../utils/apiResponse');
const apiError = require('../utils/apiError');
const uploadFileToCloudinary = require('../middlewares/cloudinary.middleware');
const objectIdRegex = /^[a-fA-F0-9]{24}$/;

const addQuiz = async (req, res) => {
    try {
        const { title, description, date, time, fullMarks, passMarks, numberOfQuestions, topic } = req.body;

        if ([title, description, date, time, fullMarks, passMarks, numberOfQuestions, topic].some((field) => {
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

        if (!quizId || !objectIdRegex.test(quizId)) {
            throw new apiError(400, "Invalid or missing Quiz ID");
        }

        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            throw new apiError(404, "Quiz not found");
        }
        let { question, marks, difficulty, options } = req.body;

        if ([question, marks, difficulty, options].some((f) => !f || f === '')) {
            throw new apiError(400, "All fields are required");
        }
        if (!Array.isArray(options)) {
            throw new apiError(400, "Options must be an array");
        }
        if (options.length < 2) {
            throw new apiError(400, "At least two options are required");
        }
        if (options.length > 4) {
            throw new apiError(400, "Maximum four options are allowed");
        }
        if (options.some((opt) => !opt.option || opt.option.trim() === '')) {
            throw new apiError(400, "All options must have text");
        }
        if (!options.some((opt) => opt.isCorrect == 'true')) { //since iscorrect is a string in the request body
            throw new apiError(400, "At least one correct option is required");
        }


        const image = req.file ? await uploadFileToCloudinary(req.file.path) : null;

        const newQuestion = {
            question,
            marks,
            difficulty,
            options: options.map((opt) => ({
                option: opt.option,
                isCorrect: opt.isCorrect
            })),
            image
        };
        // console.log("New question:", newQuestion);
        quiz.questions.push(newQuestion);
        await quiz.save();

        res.status(201).json(new apiResponse(201, "Question added successfully", quiz.questions.at(-1)));
    } catch (error) {
        console.error("Add question error:", error);
        res.status(500).json({
            message: error.message || "Internal Server Error",
            success: false
        });
    }
};


const getQuizzes = async (req, res) => {
    try {
        const { status } = req.query;


        const filter = {}
        if (status) {
            if (!['upcoming', 'completed', 'ongoing'].includes(status)) {
                throw new apiError(400, "Invalid status filter. Allowed values: upcoming, completed, ongoing");
            }
            filter.status = status;
        }
        const quizzes = await Quiz.find(filter).populate('topic').sort({ createdAt: -1 });
        res.status(200).json(new apiResponse(200, "Quizzes fetched successfully", quizzes));
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message,
            success: false,
        });
    }
}

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
            throw new apiError(400, "Invalid or missing Quiz ID");
        }

        const quiz = await Quiz.findById(quizId).populate('topic');
        if (!quiz) {
            throw new apiError(404, "Quiz not found");
        }

        if (questionIndex === undefined) {
            return res.status(200).json(new apiResponse(200, "All questions fetched successfully", {
                questions: quiz.questions,
                length: quiz.questions.length,
            }));
        }


        const index = Number(questionIndex);
        if (isNaN(index)) {
            throw new apiError(400, "Question index must be a number");
        }
        if (index < 0 || index >= quiz.questions.length) {
            throw new apiError(400, "Question index out of bounds");
        }

        const question = quiz.questions[index];
        res.status(200).json(new apiResponse(200, "Question fetched successfully", {
            question,
            length: quiz.questions.length,
        }));

    } catch (error) {
        console.error("Error fetching question:", error);
        res.status(500).json({
            message: error.message || "Internal Server Error",
            success: false,
        });
    }
};

const updateQuiz = async (req, res) => {
    try {
        const quizId = req.params.quizId;

        if (!quizId || !objectIdRegex.test(quizId)) {
            throw new apiError(400, "Invalid or missing Quiz ID");
        }
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            throw new apiError(404, "Quiz not found");
        }

        const updateQuiz = await Quiz.findByIdAndUpdate(quizId, req.body, { new: true });

        if (!updateQuiz) {
            throw new apiError(404, "Failed to update quiz");
        }
        const updatedQuiz = await Quiz.findById(quizId).populate('topic');

        res.status(200).json(new apiResponse(200, "Quiz updated successfully", updatedQuiz));
    } catch (error) {
        console.error("Error updating quiz:", error);
        res.status(500).json({
            message: error.message || "Internal Server Error",
            success: false,
        });

    }
}


module.exports = {
    addQuiz,
    addQuestion,
    getQuizById,
    getQuestion,
    getQuizzes,
    updateQuiz,
}
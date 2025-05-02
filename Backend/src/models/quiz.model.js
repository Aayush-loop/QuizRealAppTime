const mongoose = require('mongoose');
const questionAnswerSchema = require('./questionAnswer.model');

const quizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },

    fullMarks: {
        type: Number,
        required: true,
    },
    passMarks: {
        type: Number,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    numberOfQuestions: {
        type: Number,
        required: true,
    },
    topic: {
        type: String,
        required: true,
    },
    bannerImage: {
        type: String,
        required: false,
    },
    questions: {
        type: [questionAnswerSchema],
        required: false,
    },

});

const Quiz = mongoose.model('Quiz', quizSchema);
module.exports = Quiz;
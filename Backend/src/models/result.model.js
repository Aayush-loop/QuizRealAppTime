const mongoose = require('mongoose');

const resultSchema = mongoose.Schema({
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    submission: [
        {
            question: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
            },
            timeTaken: {
                type: Number,
                required: true,
            },
            submittedAnswer: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                }
            ],
            obtainedMarks: {
                type: Number,
                default: 0,
            }

        }
    ]


}, { timestamps: true });

const Result = mongoose.model('Result', resultSchema);
module.exports = Result;
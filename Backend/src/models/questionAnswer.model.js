const mongoose = require('mongoose');

const questionAnswerSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    options: [
        {
            option: {
                type: String,
                required: true,
            },
            isCorrect: {
                type: Boolean,
                default: false,
            }
        }
    ],
    difficulty: {
        type: String,
        enum: ['easy', 'moderate', 'hard'],
        default: 'easy',
    },
    marks: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: false,
    }

}, { timestamps: true });


// questionAnswerSchema.pre(/^find/, function (next) {
//     this.populate([
//         { path: 'quiz', select: 'title description date time fullMarks passMarks duration numberOfQuestions topic bannerImage' }
//     ])
// })

// const QuestionAnswer = mongoose.model('QuestionAnswer', questionAnswerSchema);
// module.exports = QuestionAnswer;

module.exports = questionAnswerSchema;
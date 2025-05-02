const router = require('express').Router();
const { addQuiz, addQuestion, getQuizById, getQuestion } = require('../controllers/quiz.controller');
const upload = require('../middlewares/multer.middleware');

router.post('/add', upload.single('bannerImage'), addQuiz);
router.patch('/add/:quizId', upload.array('images'), addQuestion);
router.get('/:quizId', getQuizById);
router.get('/:quizId/question', getQuestion);

module.exports = router;
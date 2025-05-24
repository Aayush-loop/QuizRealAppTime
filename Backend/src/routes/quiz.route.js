const router = require('express').Router();
const { addQuiz, addQuestion, getQuizById, getQuestion, getQuizzes, getQuizByJoinCode } = require('../controllers/quiz.controller');
const upload = require('../middlewares/multer.middleware');

router.post('/add', upload.single('bannerImage'), addQuiz);
router.patch('/add/:quizId', upload.single('image'), addQuestion);
router.get('/:quizId', getQuizById);
router.get('/:quizId/question', getQuestion);
router.get('/', getQuizzes);
router.get("/joinCode/:joinCode", getQuizByJoinCode);

module.exports = router;
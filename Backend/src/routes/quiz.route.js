const router = require('express').Router();
const { addQuiz } = require('../controllers/quiz.controller');
const upload = require('../middlewares/multer.middleware');

router.post('/quiz', upload.single('bannerImage'), addQuiz);
router.patch('/quiz/:quizId', upload.single('bannerImage'), addQuiz);

module.exports = router;
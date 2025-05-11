const router = require('express').Router();
const { getResult, getMyLeaderBoard, overallLeaderboard, getQuizLeaderboard } = require('../controllers/result.controller');
const { checkLogin } = require('../middlewares/auth.middleware');

router.get('/', checkLogin, getResult);
router.get('/leaderboard/me', checkLogin, getMyLeaderBoard);
router.get('/leaderboard', checkLogin, overallLeaderboard)
router.get('/leaderboard/:quizId', getQuizLeaderboard);
module.exports = router;
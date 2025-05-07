const router = require('express').Router();
const { getResult } = require('../controllers/result.controller');
const { checkLogin } = require('../middlewares/auth.middleware');

router.get('/', checkLogin, getResult);
module.exports = router;
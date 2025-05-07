const router = require('express').Router();
const { registerUser, loginUser, logoutuser, getProfile } = require('../controllers/auth.controller');
const upload = require('../middlewares/multer.middleware');
const { checkLogin } = require('../middlewares/auth.middleware');



router.post('/register', upload.single('image'), registerUser);
router.post('/login', loginUser);
router.post('/logout', checkLogin, logoutuser);
router.get('/check', checkLogin, getProfile)

module.exports = router;
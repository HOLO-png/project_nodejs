const router = require("express").Router();
const userCtrl = require('../controllers/userCtrl.js');
const auth = require('../middleware/auth.js');

router.post('/register', userCtrl.register);

router.post('/activate', userCtrl.activateEmail);

router.post('/login', userCtrl.login);

router.post('/refresh_token', userCtrl.getAccessToken);

router.post('/forgot-password', userCtrl.forgotPassword);

router.post('/reset-password', auth, userCtrl.resetPassword);

router.get('/logout', userCtrl.logout);

// social login
router.post('/google_login', userCtrl.googleLogin);

router.post('/facebook_login', userCtrl.facebookLogin);



module.exports = router;
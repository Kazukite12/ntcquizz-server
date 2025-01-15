const router = require("express").Router();
const { register, login, getProfile,verifyOtp } = require('./user.controller');



router.post('/register', register);
router.post('/login', login);
router.post('/verify-otp', verifyOtp);

module.exports = router;

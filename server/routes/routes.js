const express = require('express')
const router = express.Router()

const sendOtpController = require('../controller/otp/sendOtp')
const verifyOtpController = require('../controller/otp/verifyOtp')
const signUpController = require('../controller/user/signUp')
const loginController = require('../controller/user/login')



router.post('/send-otp', sendOtpController)
router.post('/verify-otp', verifyOtpController)

router.post('/register', signUpController)
router.post('/login', loginController)


module.exports = router
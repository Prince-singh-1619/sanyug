const express = require('express')
const router = express.Router()

const sendOtpController = require('../controller/otp/sendOtp')
const verifyOtpController = require('../controller/otp/verifyOtp')
const signUpController = require('../controller/user/signUp')
const loginController = require('../controller/user/login')
const searchUserController = require('../controller/user/searchUser')
const addUserToChatController = require('../controller/user/addUserToChat')
const fetchConvoController = require('../controller/convo/fetchConvo')
const storeMessageController = require('../controller/message/storeMessage')
const fetchMessageController = require('../controller/message/fetchMessage')



router.post('/send-otp', sendOtpController)
router.post('/verify-otp', verifyOtpController)

router.post('/register', signUpController)
router.post('/login', loginController)
router.get('/search-user', searchUserController)
router.post('/conversations/add-user-to-chat', addUserToChatController)
router.get('/fetch-convo', fetchConvoController)

router.post('/store-message', storeMessageController)
router.get('/fetch-message', fetchMessageController)


module.exports = router
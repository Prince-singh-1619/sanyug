const express = require('express')
const router = express.Router()

const multer = require('multer')
const upload = multer({ dest: "temp/" })  //temporary storage

const sendOtpController = require('../controller/otp/sendOtp')
const verifyOtpController = require('../controller/otp/verifyOtp')
const signUpController = require('../controller/user/signUp')
const loginController = require('../controller/user/login')
const searchUserController = require('../controller/user/searchUser')
const addUserToChatController = require('../controller/user/addUserToChat')
const fetchConvoController = require('../controller/convo/fetchConvo')
const storeMessageController = require('../controller/message/storeMessage')
const fetchMessageController = require('../controller/message/fetchMessage')
const deleteMessageController = require('../controller/message/deleteMessage')
const authToken = require('../middleware/authToken')
const googleAuthController = require('../controller/user/googleAuth')
const storeMediaController = require('../controller/message/storeMedia')



router.post('/send-otp', sendOtpController)
router.post('/verify-otp', verifyOtpController)
router.post('/register', signUpController)
router.post('/login', loginController)
router.post('/auth/google', googleAuthController)

router.get('/search-user', authToken, searchUserController)
router.post('/conversations/add-user-to-chat', authToken, addUserToChatController)
router.get('/fetch-convo', authToken, fetchConvoController)

router.post('/store-message', authToken, storeMessageController)
router.get('/fetch-message', authToken, fetchMessageController)
router.put('/remove-message', authToken, deleteMessageController)
router.post('/store-media', authToken, upload.single("file"), storeMediaController)

module.exports = router
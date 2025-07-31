const mongoose = require('mongoose')

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 1200 // auto-delete after 15 minutes (MongoDB TTL index)
    }
})

const otpModel = mongoose.model("Otp", otpSchema)
module.exports = otpModel
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    profilePic: {
        highResPic:{ type: String, default: "" },  // cloudinary url
        highResPicPublicId: { type: String, default: "" }, //for deletion
        lowResPic: { type: String, default: "" },  // mongoDB 
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        default: "Hello, I'm on Sanyug"
    },
    lastSeen: {
        type: Date,
        default: Date.now
    },
}, { timestamps: true });

const userModel = mongoose.model("User", userSchema)
module.exports = userModel
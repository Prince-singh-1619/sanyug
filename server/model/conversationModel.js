const mongoose = require('mongoose')

const conversationSchema = new mongoose.Schema({
    participants: {
        type: [mongoose.Types.ObjectId],
        ref: 'User',
        required: true
    },
    isGroup: {
        type: Boolean,
        default: false
    },
    groupName: {
        type: String,
        required: function () { return this.isGroup; } // only required if it's a group
    },
    groupAdmin: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    lastMessage: {
        text: { type: String },
        sender: { type: mongoose.Types.ObjectId, ref: 'User' },
        createdAt: { type: Date }
    }
}, {timestamps: true})

const conversationModel = mongoose.model('Conversation', conversationSchema)
module.exports = conversationModel
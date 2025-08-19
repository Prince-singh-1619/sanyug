const mongoose = require('mongoose')

const conversationSchema = new mongoose.Schema({
    isGroup: {
        type: Boolean,
        default: false
    },
    participants: {
        type: [mongoose.Types.ObjectId],
        ref: 'User',
        required: true
    },
    groupName: {
        type: String,
        trim : true,
        default: null,
        required: function () { return this.isGroup; } // only required if it's a group
    },
    groupImage: {
        type: String,
        default: null,
    },
    groupAdmin: [{  // might be multiple admins
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }],
    lastMessage: {
        text: { type: String },
        sender: { type: mongoose.Types.ObjectId, ref: 'User' },
        createdAt: { type: Date, default: Date.now }
    }
}, {timestamps: true})

const conversationModel = mongoose.model('Conversation', conversationSchema)
module.exports = conversationModel
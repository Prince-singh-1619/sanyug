const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // receiver:{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    //     required: true
    // },
    text: {
        type: String,
        trim: true,
        default: ''
    },
    media: {
        type: {
            type: String, // e.g., 'image', 'video', 'file'
            enum: ['image', 'video', 'file'],
            required: false
        },
        url: {
            type: String,
            required: function () { return this.media?.type; }
        }
    },
    readBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, { timestamps: true });

const messageModel = mongoose.model('Message', messageSchema)
module.exports = messageModel
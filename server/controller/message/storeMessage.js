const messageModel = require("../../model/messageModel")

async function storeMessageController(req, res){
    try {
        const {convoId, userId, message, media, isRead} = req.body

        if(!convoId) throw new Error("ConversationId is required")
        if(!userId) throw new Error("userId is required")
        if(!message) throw new Error("please enter a message")

        const newMessage = new messageModel({
            conversationId: convoId,
            sender: userId,
            text: message,
            media: media || null,
            isRead: isRead || false
        })
        const store = await newMessage.save()

        return res.status(200).json({
            message: "Message stored successfully",
            data: store,
            success: true,
            error: false
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message || "Message not send",
            error: true,
            success: false
        })
    }
}

module.exports = storeMessageController
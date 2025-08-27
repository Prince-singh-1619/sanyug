const messageModel = require("../../model/messageModel")
const conversationModel = require("../../model/conversationModel")

async function storeMessageController(req, res){
    try {
        const {convoId, sender, text, media, isRead} = req.body

        if(!convoId) throw new Error("ConversationId is required")
        if(!sender) throw new Error("userId is required")
        if(!text) throw new Error("please enter a message")

        const newMessage = new messageModel({
            conversationId: convoId,
            sender,
            text,
            media: media || null,
            isRead: isRead || false
        })
        const store = await newMessage.save()

        //update last Message
        const last = await conversationModel.findById(convoId)
        if(!last) throw new Error("lastMessage couldn't be updated")
        last.lastMessage.text=text
        last.lastMessage.sender=sender
        await last.save()

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
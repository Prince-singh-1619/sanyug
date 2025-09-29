const messageModel = require("../../model/messageModel")
const conversationModel = require("../../model/conversationModel")

async function storeMessageController(req, res){
    try {
        const {convoId, sender, text, media, isRead} = req.body

        if(!convoId) throw new Error("ConversationId is required")
        if(!sender) throw new Error("userId is required")
        if(!text && !media)throw new Error("please enter a message")
        if(media && !text) text="File attached"

        const conversation = await conversationModel.findById(convoId).select("participants");
        if (!conversation) throw new Error("Conversation not found");
        
        // total receivers = all participants except sender
        const totalReceivers = conversation.participants.length-1;

        const newMessage = new messageModel({
            conversationId: convoId,
            sender,
            text,
            media: media || null,
            totalReceivers, // send totalReceivers from frontend,
            deliveredTo: [],
            readBy: []
        })
        const store = await newMessage.save()

        // Emit via socket.io (attach io to req in app.js)
        conversation.participants.forEach(memberId => {
            if (memberId.toString() !== sender.toString()) {
                req.io.to(memberId.toString()).emit("new-message-received", store);
                console.log("message saved successfully", store);
            }
        });

        return res.status(200).json({
            message: "Message stored successfully",
            data: store,
            success: true,
            error: false
        })
    } 
    catch (error) {
        return res.status(400).json({
            message: error.message || "Message not send",
            error: true,
            success: false
        })
    }
}

module.exports = storeMessageController
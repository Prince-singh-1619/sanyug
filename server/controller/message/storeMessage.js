const messageModel = require("../../model/messageModel")
const conversationModel = require("../../model/conversationModel")

async function storeMessageController(req, res){
    try {
        const {convoId, sender, text, media, isRead} = req.body

        if(!convoId) throw new Error("ConversationId is required")
        if(!sender) throw new Error("userId is required")
        if(!text) throw new Error("please enter a message")

        const conversation = await conversationModel.findById(convoId).select("participants");
        if (!conversation) throw new Error("Conversation not found");
        // total receivers = all participants except sender
        const totalReceivers = conversation.participants.filter(
            (id) => id.toString() !== sender.toString()
        ).length;

        const newMessage = new messageModel({
            conversationId: convoId,
            sender,
            text,
            media: media || null,
            // isRead: isRead || false
            totalReceivers,
            deliveredTo: [],
            readBy: []
        })
        const store = await newMessage.save()

        // Update conversation's lastMessage
        await conversationModel.findByIdAndUpdate(
            convoId,
            {
                $set: {
                    "lastMessage.msgId": store._id,
                    "lastMessage.text": text,
                    "lastMessage.sender": sender
                }
            },
            { new: true }
        );


        // const conversation = await conversationModel.findById(convoId).select("participants");
        // Emit via socket.io (attach io to req in app.js)
        conversation.participants.forEach(memberId => {
            if (memberId.toString() !== sender.toString()) {
                req.io.to(memberId.toString()).emit("receiveMessage", store);
            }
        });
        // Confirm to sender as "sent"
        req.io.to(sender.toString()).emit("messageSent", store._id);


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
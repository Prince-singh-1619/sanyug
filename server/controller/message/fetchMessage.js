const messageModel = require("../../model/messageModel");

async function fetchMessageController(req, res){
    try{
        const {convoId, userId} = req.query
        if(!convoId) throw new Error("ConversationId is required")
        if(!userId) throw new Error("userId is required")

        const messages = await messageModel.find({
            // $or: [
                // { 
                    conversationId: convoId 
                // }
                // { sender: userId },
                    // { receiver: userId } // only if you store receiverId
            // ]
        }).sort({ createdAt: 1 }); // ascending order

        return res.status(200).json({
            message: "Messages fetched successfully",
            data: messages,
            success: true,
            error: false
        });

    }
    catch (error) {
        return res.status(400).json({
            message: error.message || "Message not send",
            error: true,
            success: false
        })
    }
}

module.exports = fetchMessageController
const messageModel = require("../../model/messageModel")
const cloudinary = require('cloudinary').v2

async function deleteMessageController(req, res){
    try {
        const {msgId} = req.body
        console.log("msgId: ", msgId)
        if(!msgId) throw new Error("Message Id required")

        const io = req.app.get("io");

        const message = await messageModel.findById(msgId)
        if(!message) throw new Error("Message not found or not exists")

        if(message.media && message.media.publicId){
            console.log("Trying to delete:", message.media.publicId, message.media.type);
            try {
                await cloudinary.uploader.destroy(message.media.publicId, {
                    resource_type:  message.media.type === "image" ? "image" : ( message.media.type === "video" ? "video" : "raw"),
                })
                console.log("Deleted from cloudinary")
            } catch (error) {
                console.error("Cloudinary delete error: ", error)
            }
        }

        message.text = "Message Deleted"
        message.isRemoved = true
        message.media=null
        await message.save()

        // Emit socket event to all clients
        io.emit("messageDeleted", {
            msgId: message._id,
            convoId: message.convoId, // assuming you store convoId in messageModel
            updatedText: message.text,
            isRemoved: true
        });

        return res.status(200).json({
            message: "Message removed",
            data: message,
            success: true,
            error: false
        })

    } catch (error) {
        return res.status(400).json({
            message: error.message || "Message not deleted",
            error: true,
            success: false
        })
    }
}

module.exports = deleteMessageController
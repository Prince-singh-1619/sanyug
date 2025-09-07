const conversationModel = require("../../model/conversationModel")
const messageModel = require("../../model/messageModel")

async function fetchConvoController(req, res){
    try {
        const {userId} = req.query
        if(!userId) throw new Error('userId is required')

        const convos = await conversationModel
            .find({participants: userId})
            .populate({
                path: 'participants',
                select: '_id firstName lastName profilePic'
            })
            // remove this and add directly fetch from messageModel for last message
            .populate({
                path: 'lastMessage',
                select: 'text createdAt'
            })
            .sort({updatedAt: -1}) // Most recent first
        
        const convoIds = convos.map(c=>c._id) // reusable for updateMany

        if(convoIds.length > 0){
            await messageModel.updateMany(
                { 
                    conversationId: {
                        // $in: await conversationModel.find({ participants:userId}).distinct("_id")
                        $in: convoIds
                    },
                    sender: { $ne: userId },    // don’t deliver your own messages
                    deliveredTo: { $ne: userId },   // not already marked as delivered
                    readBy: { $ne: userId},      // not already read
                },
                {
                    $addToSet: {deliveredTo: userId}    // mark as delivered
                }
            )
        }

        res.status(200).json({
            message: "Conversations fetched successfully",
            data: convos,
            error: false,
            success: true
        })
    } 
    catch (error) {
        res.status(400).json({
            message: error.message || "Some error occurred",
            error: true,
            success: false
        })
    }
}

module.exports = fetchConvoController
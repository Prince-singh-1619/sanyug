const conversationModel = require("../../model/conversationModel")
const messageModel = require("../../model/messageModel")

async function fetchConvoController(req, res){
    try {
        const {userId} = req.query
        // console.log("fetchConvoController called with userId:", userId);
        if(!userId) throw new Error('userId is required')

        const convoData = await conversationModel
            .find({participants: userId})
            .populate({
                path: 'participants',
                // select: '_id firstName lastName profilePic lastSeen'
                select: '_id firstName lastName username profilePic isVerified status lastSeen createdAt'
            })
            .sort({updatedAt: -1}) // Most recent first
        .lean(); // convert to plain JS object

        const fullConvoData = await Promise.all(
            convoData.map(async convo =>{
                const msg = await messageModel
                    .findOne({conversationId: convo._id})
                    .sort({createdAt: -1})
                    .select("text sender media.filename createdAt deliveredTo readBy")
                .lean();
                const unreadCount = await messageModel.countDocuments({
                    conversationId: convo._id,
                    sender: {$ne: userId},
                    readBy: {$ne: userId}
                })
                return { ...convo, lastMessage: msg || null, unreadCount }; // combining conversation data with last message
            }),
        )

        // fullConvoData = {...fullConvoData, unreadCount}
        
        const convoIds = convoData.map(c=>c._id) // reusable for updateMany

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
            data: fullConvoData,
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
const conversationModel = require("../../model/conversationModel")

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
            .populate({
                path: 'lastMessage',
                select: 'text createdAt'
            })
            .sort({updatedAt: -1}) // Most recent first

        res.status(200).json({
            message: "Conversations fetched successfully",
            data: convos,
            error: false,
            success: true
        })
    } 
    catch (error) {
        res.status(400).json({
            message: EvalError.message || "Some error occurred",
            error: true,
            success: false
        })
    }
}

module.exports = fetchConvoController
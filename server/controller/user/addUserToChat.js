const conversationModel = require("../../model/conversationModel");

async function addUserToChatController(req, res){
    try {
        const { participants } = req.body;

        if (!participants || participants.length !== 2) {
            return res.status(400).json({ message: 'Two participants required' });
        }

        // Check if conversation already exists
        let conversation = await conversationModel.findOne({
            isGroup: false,
            participants: { $all: participants, $size: 2 }
        }).populate('participants', '-password');
        if(conversation){
            res.status(200).json({message:"User already exists", success: true})
        }

        if (!conversation) {
        // Create new conversation
        conversation = await conversationModel.create({
            participants,
            isGroup: false
        });

        conversation = await conversation.populate('participants', '-password');
        }

        res.status(200).json(conversation);
    } catch (err) {
        // console.error(err);
        res.status(500).json({ 
            message: error.message || 'Server error' ,
            error: true,
            success: false,
        });
    }
}

module.exports = addUserToChatController
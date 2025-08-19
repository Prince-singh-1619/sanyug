const userModel = require('../../model/userModel')

const searchUser = async (req, res) => {
    try {
        const { username, userId } = req.query
        console.log("userId received: ", userId)
        
        if (!username) {
            return res.status(400).json({
                success: false,
                message: "Username is required"
            })
        }

        const user = await userModel.findOne({ 
            username: { $regex: username, $options: 'i' },
            _id: { $ne: userId }
        }).select('-password')

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        res.status(200).json({
            success: true,
            message: "User found",
            user
        })

    } catch (error) {
        console.error("Error searching user:", error)
        res.status(500).json({
            message: error.message || "Internal server error",
            success: false,
            error: true,
        })
    }
}

module.exports = searchUser 
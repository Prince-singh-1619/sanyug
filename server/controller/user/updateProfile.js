const userModel = require("../../model/userModel")
const cloudinary = require('cloudinary').v2

async function updateProfileController(req, res){
    try {
        console.log("inside updateProfileController")
        console.log(req.body);
        
        const {userId, profilePic, firstName, lastName, username, email, status} = req.body
        if(!userId) throw new Error("UserId not received")

        // Check for duplicate username (ignore current user)
        if (username) {
            const existingUser = await userModel.findOne({ username, _id: { $ne: userId } });
            if (existingUser) {
                return res.json({
                    message: "Username already exists.",
                    success: false,
                    error: true,
                });
            }
        }

        const updateFields = { firstName, lastName, email, status };
        if (profilePic) {
            if(profilePic.highResPic!==undefined) updateFields["profilePic.highResPic"] = profilePic.highResPic;
            if(profilePic.highResPicPublicId!==undefined) updateFields["profilePic.highResPicPublicId"] = profilePic.highResPicPublicId;
            if(profilePic.lowResPic!==undefined) updateFields["profilePic.lowResPic"] = profilePic.lowResPic;
        }

        // delete from cloudinary, if removing DP
        if(profilePic.lowResPic==="" && profilePic.highResPic==="" && profilePic.highResPicPublicId){
            console.log("Deleting DP: ", profilePic.highResPicPublicId);
            try {
                await cloudinary.uploader.destroy(profilePic.highResPicPublicId, {
                    resource_type: "image" 
                })
                console.log("Deleted from cloudinary")
            } catch (error) {
                console.error("DP delete error: ", error)
            }
        }

        const updatedUser = await userModel.findByIdAndUpdate( userId, {$set:updateFields}, {new:true} );

        res.json({
            data: updatedUser,
            message: "User updated successfully",
            success: true,
            error: false,
        })
    } 
    catch (error) {
        res.json({
            message: error.message || error,
            error: true, 
            success: false,
        })    
    }
}

module.exports = updateProfileController
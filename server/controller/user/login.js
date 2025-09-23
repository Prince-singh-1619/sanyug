const userModel = require("../../model/userModel")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function loginController(req, res){
    try {
        const {email, password} = req.body
        
        if(!email?.trim()) throw new Error("email is required")
        if(!password) throw new Error("password is required")

        const user = await userModel.findOne({email})
        if(!user) throw new Error("User does not exist")
        
        // google user
        if(user.password==='google-auth-user'){
            return res.status(400).json({
                message: "You signed up with Google. Please log in using Google Sign-In.",
                error: true,
                success: false
            })
        }

        const checkPassword = await bcrypt.compare(password, user.password)
        if(!checkPassword) throw new Error("Incorrect password, please try again")
            
        const tokenData = { userId: user._id }
        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, {expiresIn: 60*60*24*7})

        // const { _id, password: _, __v, ...rest } = user;

        res.status(200).json({
            message: "Login successful",
            token,
            // user: {
            //     userId: user._id,
            //     firstName: user.firstName,
            //     lastName: user.lastName,
            //     username: user.username,
            //     email: user.email,
            //     profilePic: user.profilePic,
            //     isVerified: user.isVerified,
            //     lastSeen: user.lastSeen,
            //     createdAt: user.createdAt,
            //     updatedAt: user.updatedAt
            // },
            // user: { userId: _id, ...rest._doc },
            user,
            success: true,
            error: false
        })
        
    } catch (err) {
        res.json({
            message: err.message || err,
            error: true,
            success: false
        })
    }
}

module.exports = loginController
const userModel = require('../../model/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

async function signUpController(req, res){
    try {
        const {firstName, lastName, email, password} = req.body

        // const otpVerified = await otpModel.findOne({ email, verified: true });
        // if (!otpVerified) throw new Error("Please verify OTP before signup");

        const user = await userModel.findOne({email})
        if(user) throw new Error("User already exists with same email")
        
        if(!firstName) throw new Error("Please provide first name")
        if(!lastName) throw new Error("Please provide last name")
        if(!email) throw new Error("Please provide email")
        if(!password) throw new Error("Please provide password")

        //creating username from email
        const username = email.split("@")[0]

        //hashing password
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, salt)
        // if(!hashedPassword) throw new Error("Something went wrong in hashed password")

        const payload = {
            firstName,
            lastName,
            username,
            email,
            password: hashedPassword,
            isVerified: true
        }

        const newUser = new userModel(payload)
        const saveUser = await newUser.save()

        // if (!process.env.TOKEN_SECRET_KEY) throw new Error("Token secret key not set in environment");
        const tokenPayload = { userId: saveUser._id }
        const token = jwt.sign(tokenPayload, process.env.TOKEN_SECRET_KEY, {expiresIn: 60*60*24*7})
        
        const { password: _, ...userWithoutPassword} = saveUser.toObject();

        res.status(201).json({
            message: "User created successfully",
            token,
            user: userWithoutPassword,
            success: true, 
            error: false,
        })
    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        })
    }
}

module.exports = signUpController
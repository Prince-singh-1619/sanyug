const express = require('express');
const nodemailer = require('nodemailer');
const otpModel = require('../../model/otpModel');
const router = express.Router();

const otpStore = {};

async function sendOtpController(req, res){
    try {
        // const {email} = req.body;
        const email = req.body.email?.toLowerCase().trim();
        const otp = Math.floor(100000 + Math.random() * 900000).toString()

        // delete previous
        await otpModel.deleteMany({ email })
        // create new one
        await otpModel.create({ email, otp})

        // otpStore[email] = otp
        console.log(`Storing OTP for ${email}:`, otp);

        //send via email
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.ADMIN_EMAIL,
                pass: process.env.ADMIN_EMAIL_PASSWORD
            }
        });

        await transporter.sendMail({
            from: 'Sanyug_Team@gmail.com',
            to: email,
            subject: 'Sanyug OTP Code',
            text: `Dear User,
            
Your One Time Password (OTP) for Sanyug web app is ${otp}. Do not share this OTP with anyone.
            
Please note: The OTP is valid for only one session or 15 minutes. If you refresh the page or leave the Sanyug app, you will need to generate a new OTP.
            `
        });

        res.status(200).json({
            message: 'OTP sent!',
            success: true,
            error: false 
        });    
    } 
    catch (error) {
        res.json({
            error: error.message || error,
            message: 'Error sending OTP!',
            success: false,
            error: true 
        })    
    }
}

module.exports = sendOtpController
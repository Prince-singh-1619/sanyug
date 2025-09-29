const otpModel = require("../../model/otpModel");

async function verifyOtpController(req, res){
    try {
        const email = req.body.email?.toLowerCase().trim();
        const otp = req.body.otp?.trim();

        if (!email || !otp) {
            return res.status(400).json({
                verified: false,
                error: 'Email and OTP are required',
                message: 'Email and OTP are required'
            });
        }
        const otpRecord = await otpModel.findOne({email, otp})
        if (!otpRecord) {
            return res.status(400).json({
                verified: false,
                message: 'Invalid or expired OTP'
            });
        }

        // OTP matched, delete after use
        await otpModel.deleteOne({ _id: otpRecord._id });
    
        // console.log("Verifying OTP for:", email, "=>", otp);

        return res.status(200).json({ 
            verified: true,
            message: "verified"
        });

    } catch (error) {
        res.status(500).json({
            verified: false,
            message: error.message || 'Server error',
            error: true,
            success: false,
        });
    }
}

module.exports = verifyOtpController
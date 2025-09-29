const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../../model/userModel'); 

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function googleAuthController(req, res) {
    try {
        const { idToken } = req.body;

        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload(); // user info
        const { email, name, picture } = payload;
        const username = email.split("@")[0]

        let user = await User.findOne({ email });

        if (!user) {
            // Split the full name into firstName and lastName
            const nameParts = name.split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';

            // Create user with Google data
            user = await User.create({ 
                firstName, 
                lastName, 
                username,
                email, 
                password: 'google-auth-user', // Placeholder password for Google users
                profilePic: picture,
                isVerified: true,
                lastSeen: Date.now()
            });
        }

        // Create JWT for your own session
        const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET_KEY, {
            expiresIn: '7d',
        });
        
        const { _id, password: _, __v, ...rest } = user;

        res.json({ 
            token, 
            user,
        });
    } catch (err) {
        console.error(err);
        res.status(401).json({ error: "Invalid Google login" });
    }
};

module.exports = googleAuthController
const jwt = require('jsonwebtoken')

async function authToken(req, res, next){
    try {
        // const token = req.cookies?.token
        const authHeader = req.headers.authorization // Extract token
        const token = authHeader && authHeader.split(" ")[1];
        if(!token){
            return res.status(401).json({
                message: "No token provided in backend",
                error: true, 
                success: false
            })
        }

        jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, decoded) => {
            if (err) {
                console.error("JWT verification error:", err.message);
                return res.status(401).json({
                    message: "Invalid or expired token",
                    success: false,
                    error: true,
                });
            }

            req.userId = decoded._id || decoded.id; // use correct field
            next();
        });

    } 
    catch (err) {
        res.status(500).json({
            message: err.message || err,
            success: false,
            error: true
        })    
    }
}

module.exports = authToken
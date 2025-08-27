const jwt = require('jsonwebtoken')

async function authToken(req, res, next){
    try {
        // const token = req.cookies?.token
        const token = req.headers.authorization?.split(" ")[1]; // Extract token
        if(!token){
            return res.status(200).json({
                message: "Please Log in...",
                error: true, 
                success: false
            })
        }

        jwt.verify(token, process.env.TOKEN_SECRET_KEY, function(err, decoded){
            console.log(err)
            console.log("decoded", decoded)

            if(err) console.log("Error in authToken", err)

            req.userId = decoded?._id
            next()
        })

    } 
    catch (err) {
        res.status(400).json({
            message: err.message || err,
            data: [],
            success: false,
            error: true
        })    
    }
}

module.exports = authToken
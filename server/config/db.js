const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

const connectDB = async() =>{
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            ssl: true,
            tlsAllowInvalidCertificates: false
        })
        console.log("MongoDB connected")
    } catch (err) {
        console.log("MongoDB connection error: ", err)
    }
}

module.exports = connectDB
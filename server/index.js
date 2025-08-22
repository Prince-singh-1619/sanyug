const dotenv = require('dotenv')
dotenv.config()     //load env variables

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const connectDB = require('./config/db')
const http = require("http")
const {Server} = require('socket.io')

// const cookieParser = require('cookie-parser')
const router = require('./routes/routes')

const app = express()
const PORT = process.env.PORT || 8080

connectDB()

//middleware
app.use(cors(
    {
        origin: process.env.FRONTEND_URL,
        // origin: allowedOrigins,
        credentials: true,
        methods: ["POST", "GET", "PUT", "DELETE"],
    }
))
app.use(express.json({ limit:'2mb' }))
// app.use(cookieParser())

const server = http.createServer(app)
// Creating socket.io server
const io = new Server(server, {
    cors:{
        origin: process.env.FRONTEND_URL,
        // origin: allowedOrigins,
        credentials: true,
        methods: ["POST", "GET", "PUT", "DELETE"],
    }
})

// socket events
io.on("connection", (socket)=>{
    console.log("user connected", socket.id)
    // when client sends message
    socket.on("sendMessage", (data)=>{
        console.log("message received", data)
        // send to all clients
        io.emit("receiveMessage", data)
        io.emit("updatedConvoList", {
            convoId: data.convoId,
            lastMessage: data.text,
            createdAt: data.createdAt,
        });
    })
    // // update conversation list 
    // socket.on("newConvo", (data)=>{
    //     io.emit("updatedConvoList", data)
    // })
    socket.on("disconnect", ()=>{
        console.log("user disconnected", socket.id)
    })
})

//DB Connection
// mongoose.connect(process.env.MONGODB_URI, 
//     {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//         ssl: true,
//         tlsAllowInvalidCertificates: false
//     }
// )
// .then(()=> console.log("MongoDB Connected"))
// .catch(err => console.error("MongoDB connection error: ", err))

app.use("/api", router)

//start server
// app.listen(PORT, ()=>{
//     console.log(`Server is running on http://localhost:${PORT}`)
// })
server.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
})
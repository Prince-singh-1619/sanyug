const jwt = require("jsonwebtoken");
const userModel = require("./model/userModel");
const messageModel = require("./model/messageModel");

async function updateUserLastSeen(userId) {
  try {
    await userModel.findByIdAndUpdate(
      userId,
      { lastSeen: new Date() },
      { new: true } // returns updated doc if you ever need it
    );
  } catch (error) {
    // console.error(`Failed to update last seen for ${userId}:`, error.message);
  }
}

function serverSocketHandler(io){
  const onlineUsers = new Map();
  
  io.on("connection", (socket) => {
    // console.log("New socket connection:", socket.id);
  
    const token = socket.handshake.auth?.token;
    if (!token) {
      console.log("No token provided in socket");
      socket.disconnect();
      return;
    }
  
    try {
      // verify token
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
      // console.log("Decoded JWT payload:", decoded);
      const userId = decoded.userId; // assuming your JWT payload has { id: user._id }
  
      socket.join(userId.toString());
      console.log(`User ${userId} joined the room`);

      onlineUsers.set(userId, socket.id)
      io.emit("user-online", userId);

      socket.on("get-online-users", ()=>{
        socket.emit("all-online-users", [...onlineUsers.keys()])
      })

      // optional: let frontend know connection is good
      socket.emit("connected", { userId });

      // Listen for ping from client
      socket.on("ping", () => {
        socket.emit("pong"); // reply with pong
      });
  
      socket.on("user_logout", async({userId})=>{
        await updateUserLastSeen(userId);
        io.emit("user_disconnected", {userId})
      })
  
      // cleanup when disconnected
      socket.on("disconnect", async() => {
        onlineUsers.delete(userId)
        io.emit("user-offline", userId)
        await updateUserLastSeen(userId);
        // console.log(`User ${userId} disconnected`);
        // console.log("socket.activeParticipants", socket.activeParticipants, "socket.activeConvoId", socket.activeConvoId)
        // if(socket.activeParticipants && socket.activeConvoId){
        //   socket.activeParticipants.forEach(memberId => {
        //     if(memberId.toString() !== userId){
        //       io.to(memberId.toString()).emit("participant-left-active", { activeConvoId_otherSide:null, sender:userId });
        //       console.log("participant-left-active (disconnect)", socket.activeConvoId);
        //     }
        //   })
        // }
  
        // socket.activeConvoId = null;
        // socket.activeParticipants = [];
      });
    } 
    catch (err) {
      // console.log("Invalid token:", err.message);
      socket.disconnect();
    }

  
    // for receiving new convos
    socket.on("new-convo-added", ({ newConvoForB, userId })=>{
      const receivers = newConvoForB.participants.map(p => p._id).filter(id=> id!==userId)
      console.log("receivers: ", receivers)
      receivers.forEach(receiverId => {
        io.to(receiverId.toString()).emit("new-convo-added-received", ({newConvoForB}) );
      })
    })

    // receiving acknowledge from receiver that they got the message
    socket.on("message-delivered", async ({msgId, sender, receiver, activeConvoId})=>{
      try {
        await messageModel.updateOne(
          {_id:msgId},
          {$addToSet: { deliveredTo: receiver } }
        )
      } catch (error) {
        console.log("Error updating deliveredTo in DB by WS")
      }
      console.log("message-delivered received at server", msgId, receiver, activeConvoId)
      io.to(sender).emit("message-delivery-confirmed", ({ msgId, receiver }))
    })

    // receive read receipt
    socket.on("message-read", async ({convoId, reader, sender})=>{
      console.log("message-read received in serverSocket")
      try {
        await messageModel.updateMany(
          {conversationId: convoId, sender},
          {$addToSet: {readBy: reader}}
        );
      } catch (error) {
        console.log("Error updating readBy in DB by WS")
      }
      sender.forEach(id=>{
        io.to(id.toString()).emit("message-read-confirmed", ({reader, convoId}))
        console.log("reader:", reader, ", convoId:", convoId)
      })
    })
  
    // receiving typing indicator from participant
    socket.on("typing", ({sender, convoId, receivers})=>{
      // console.log("typing received at server", sender, convoId, receivers)
      receivers.forEach(receiverId => {
        io.to(receiverId).emit("typing", { sender, convoId });
      })
    })
    socket.on("stoppedTyping", ({sender, convoId, receivers})=>{
      receivers.forEach(receiverId=>{
        io.to(receiverId).emit("stoppedTyping", { sender, convoId });
      })
    })
  
    // on message delete
    socket.on("message-deleted", ({msgId, convoId, receivers})=>{
      receivers.forEach(receiverId=>{
        io.to(receiverId).emit("message-delete-received", {msgId, convoId})
      })
    })
  });

  const getOnlineUsers = () => [...onlineUsers.keys()]
}

module.exports = serverSocketHandler
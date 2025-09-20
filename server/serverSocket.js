const jwt = require("jsonwebtoken");
const userModel = require("./model/userModel");

async function updateUserLastSeen(userId) {
  try {
    await userModel.findByIdAndUpdate(
      userId,
      { lastSeen: new Date() },
      { new: true } // returns updated doc if you ever need it
    );
    // console.log(`Last seen updated for user ${userId}`);
  } catch (error) {
    // console.error(`Failed to update last seen for ${userId}:`, error.message);
  }
}

function serverSocketHandler(io){
    io.on("connection", (socket) => {
      // console.log("New socket connection:", socket.id);
    
      const token = socket.handshake.auth?.token;
      if (!token) {
        // console.log("No token provided");
        socket.disconnect();
        return;
      }
    
      try {
        // verify token
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
        // console.log("Decoded JWT payload:", decoded);
        const userId = decoded.userId; // assuming your JWT payload has { id: user._id }
    
        socket.join(userId.toString());
        // console.log(`User ${userId} joined the room`);
        // console.log("socket.activeParticipants", socket.activeParticipants, "socket.activeConvoId", socket.activeConvoId)
        if(socket.activeParticipants && socket.activeConvoId){
          socket.activeParticipants.forEach(memberId => {
            if(memberId.toString() !== userId){
              io.to(memberId.toString()).emit("participant-joined-active", { activeConvoId_otherSide:socket.activeConvoId, sender:userId });
              console.log("participant-joined-active (connected)", socket.activeConvoId);
            }
          })
        }
    
        // optional: let frontend know connection is good
        socket.emit("connected", { userId });
    
        socket.on("user_logout", async({userId})=>{
          await updateUserLastSeen(userId);
          io.emit("user_disconnected", {userId})
        })
    
        // cleanup when disconnected
        socket.on("disconnect", async() => {
          // console.log(`User ${userId} disconnected`);
          // console.log("socket.activeParticipants", socket.activeParticipants, "socket.activeConvoId", socket.activeConvoId)
          if(socket.activeParticipants && socket.activeConvoId){
            socket.activeParticipants.forEach(memberId => {
              if(memberId.toString() !== userId){
                io.to(memberId.toString()).emit("participant-left-active", { activeConvoId_otherSide:null, sender:userId });
                console.log("participant-left-active (disconnect)", socket.activeConvoId);
              }
            })
          }
    
          socket.activeConvoId = null;
          socket.activeParticipants = [];
    
          if(userId) {  
            io.emit("user_disconnected", { userId });
            updateUserLastSeen(userId);
          }
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
      socket.on("message-delivered", ({msgId, sender, receiver, activeConvoId})=>{
        console.log("message-delivered received at server", msgId, receiver, activeConvoId)
        // socket.emit("message-delivery-confirmed", { msgId, receiver });
        io.to(sender).emit("message-delivery-confirmed", { msgId, receiver })
      })
    
      // receiving activeConvoId from any participant
      socket.on("active-convo-id", ({sender, activeConvoId, prevParticipants, activeParticipants})=>{
        // console.log("active-convo-id received at server", activeConvoId, sender, prevParticipants, activeParticipants)
        socket.activeConvoId = activeConvoId || null; // store activeConvoId in socket session
        socket.activeParticipants = activeParticipants || []; // store activeParticipants in socket session
    
        if (!activeConvoId) {
          // convo closed -> notify prevParticipants
          prevParticipants.forEach(memberId => {
            if (memberId.toString() !== sender) {
              io.to(memberId.toString()).emit("participant-left-active", { activeConvoId_otherSide: null, sender });
              console.log("participant-left-active (null convo)", null);
            }
          });
          return;
        }
    
        // inform all other participants about this change
        prevParticipants.forEach(memberId => {
          if (memberId.toString() !== sender) {
            io.to(memberId.toString()).emit("participant-left-active", { activeConvoId_otherSide:activeConvoId, sender });
            console.log("participant-left-active", activeConvoId);
            updateUserLastSeen(memberId);
          }
        });
        activeParticipants.forEach(memberId => {
          if (memberId.toString() !== sender) {
            io.to(memberId.toString()).emit("participant-joined-active", { activeConvoId_otherSide:activeConvoId, sender });
            console.log("participant-joined-active", activeConvoId);
          }
        });
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
}

module.exports = serverSocketHandler
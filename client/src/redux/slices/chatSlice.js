import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    activeChat: null,
    // activeConvoId: null,
    activeConvoId_otherSide: null,
    messageList: {},
};


const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setActiveChat: (state, action) =>{
            state.activeChat = action.payload.chat;
        },
        addMessage: (state, action) =>{
            const { message } = action.payload;
            const convoId = message.conversationId;
            console.log("Reducer addMessage called with:", convoId, message);

            if(!state.messageList[convoId]){
                state.messageList[convoId] = [];
            }
            state.messageList[convoId].push(message)

            // update last message in convoSlice as well
            // store.dispatch(setLastMessage({ convoId, msg: message }));
        },
        updateTempMsgId: (state, action) => {
            const { convoId, tempId, newId, newPublicId } = action.payload;
            // console.log("updateTempMsgId called with:", { convoId, tempId, newId });
            // console.log("Before update:", state.messageList[convoId]);
            state.messageList[convoId] = state.messageList[convoId].map(msg =>
                msg._id === tempId ? { ...msg, _id:newId, isTemp:false, 
                                        media:msg.media ? {...msg.media, publicId:newPublicId} : null } 
                                    : msg    
            );
            // console.log("After update:", state.messageList[convoId]);
        },
        markMessageDelivered: (state, action)=>{
            // here activeConvoId is of receiver sent from server
            const {msgId, receiver} = action.payload;
            console.log("activeConvoId_otherSide", state.activeConvoId_otherSide)

            for(const convoId in state.messageList){
                if(!state.messageList[convoId]) continue;
                // find the message by _id 
                const msg = state.messageList[convoId].find(m=> m._id===msgId);
                if(msg){
                    if(!msg.deliveredTo) msg.deliveredTo = [];
                    if (!msg.readBy) msg.readBy = [];

                    // add receiver only, if not present
                    if(!msg.deliveredTo.includes(receiver)){
                        msg.deliveredTo.push(receiver);
                        console.log("pushed")
                    }
                    // also add to readBy if activeConvoId matches
                    if(convoId===state.activeConvoId_otherSide){
                        if(!msg.readBy){
                            msg.readBy = [];
                        }
                        if(!msg.readBy.includes(receiver)){
                            msg.readBy.push(receiver);
                        }
                    }
                    
                    break; // exit loop once message is found and updated
                }
            }
        },
        markMessageAsRead: (state, action)=>{
            const { activeConvoId_otherSide, sender } = action.payload;
            state.activeConvoId_otherSide = activeConvoId_otherSide;
            console.log("activeConvoId_otherSide", state.activeConvoId_otherSide)
            // make sure to update only if activeConvoId matches
            // if(state.activeChat?.convoId !== activeConvoId_otherSide) return;
            const messages = state.messageList[activeConvoId_otherSide];
            console.log("messages in markMessageAsRead", messages)
            if(!messages) return;

            for(const msg of messages){
                if(!msg.readBy){
                    msg.readBy = [];
                }
                if(!msg.readBy.includes(sender)){
                    msg.readBy.push(sender);
                }
            }
        },
        setMessages: (state, action) =>{
            const {convoId, messages} = action.payload;
            state.messageList[convoId] = messages;
        },
        deleteMessage: (state, action) =>{ // not functioning properly, check again
            const {msgId, convoId} = action.payload
            if (!state.messageList[convoId]) return;
            
            state.messageList[convoId] = state.messageList[convoId].map((msg)=>
                msg._id===msgId ? { ...msg, text:"Message Deleted", media:null, isRemoved:true} : msg
            );
        },
        clearChatState: (state)=>{
            state.activeChat = null;
            state.activeConvoId_otherSide = null;
            state.messageList = {};
        }
    },
});

export const { 
    setActiveChat, 
    // chatUserTyping,
    addMessage, 
    updateTempMsgId, 
    markMessageDelivered,
    markMessageAsRead,
    setMessages, 
    // setUnreadMessages,
    deleteMessage, 
    clearChatState 
} = chatSlice.actions;

export default chatSlice.reducer;
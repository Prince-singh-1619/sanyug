import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    activeChat: null,
    activeConvoId: null,
    messageList: {},
};

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setActiveChat: (state, action) =>{
            state.activeChat = action.payload.chat;
            state.activeConvoId = action.payload.convoId;
        },
        addMessage: (state, action) =>{
            const {convoId, message} = action.payload;
            if(!state.messageList[convoId]){
                state.messageList[convoId] = [];
            }
            state.messageList[convoId].push(message)
        },
        updateTempMsgId: (state, action) => {
            const { convoId, tempId, newId } = action.payload;
            state.messageList[convoId] = state.messageList[convoId].map(msg =>
                msg._id === tempId ? { ...msg, _id:newId, isTemp:false } : msg
            );
        },


        // Update a message when delivered
        markMessageDelivered: (state, action) => {
            const { msgId, userId } = action.payload;

            for (const convoId in state.conversations) {
                state.conversations[convoId] = state.conversations[convoId].map((msg) =>
                msg._id === msgId
                    ? {
                        ...msg,
                        deliveredTo: [...new Set([...(msg.deliveredTo || []), userId])]
                    }
                    : msg
                );
            }
        },
        // Update messages when read
        markMessagesAsRead: (state, action) => {
            const { convoId, userId } = action.payload;

            if (state.conversations[convoId]) {
                state.conversations[convoId] = state.conversations[convoId].map((msg) =>
                msg.sender !== userId
                    ? {
                        ...msg,
                        readBy: [...new Set([...(msg.readBy || []), userId])]
                    }
                    : msg
                );
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
                msg._id===msgId ? { ...msg, text:"Message Deleted", isRemoved:true} : msg
            );
        },
        clearChatState: (state)=>{
            state.activeChat = null;
            state.messageList = {};
        }
    },
});

export const { 
    setActiveChat, 
    addMessage, 
    updateTempMsgId, 
    markMessageDelivered,
    markMessagesAsRead,
    setMessages, 
    deleteMessage, 
    clearChatState 
} = chatSlice.actions;

export default chatSlice.reducer;
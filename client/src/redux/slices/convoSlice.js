import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    convoList: [], // here convoList is an array, ___________NOT an OBJECT__________
    activeConvoId: null, // || window.href,
    prevConvoId: null,
    convoUserTyping: {},

    prevParticipants:[],
    activeParticipants:[],
}

const convoSlice = createSlice({
    name: "convo",
    initialState, 
    reducers:{
        setActiveConvo: (state, action) =>{
            const { newConvoId, participants } = action.payload;
            // shift current active to prev
            state.prevConvoId = state.activeConvoId;
            state.prevParticipants = state.activeParticipants;
            // update active convo & participants
            state.activeConvoId = newConvoId;
            state.activeParticipants = participants;
        },
        setConvos: (state, action)=> {
            const { allConvo, userId } = action.payload;
            state.convoList = allConvo;

            const allOtherParticipants = [];
            allConvo.forEach(convo=>{
                convo.participants.forEach(p=>{
                    if(p._id!==userId && !allOtherParticipants.includes(p._id)){
                        allOtherParticipants.push(p._id) 
                    }
                })
            })
            state.activeParticipants = allOtherParticipants
            // console.log("allOtherParticipants", allOtherParticipants)
        },
        convoTypingUser: (state, action)=>{
            const { sender, convoId, isTyping} = action.payload;
            if(!state.convoUserTyping){ 
                state.convoUserTyping = {};
            }
            if(!state.convoUserTyping[convoId]){
                state.convoUserTyping[convoId] = [];
            }
            if(isTyping){
                if(!state.convoUserTyping[convoId].includes(sender)){
                    state.convoUserTyping[convoId].push(sender);
                    console.log("state.convoUserTyping[convoId]", state.convoUserTyping[convoId])
                }
            }
            else{
                state.convoUserTyping[convoId] = state.convoUserTyping[convoId].filter(id => id !== sender);
            }
        },
        setLastMessage: (state, action) =>{
            const { msg } = action.payload
            console.log("msg setLastMessage:", msg);
            const convoId = msg.conversationId;
            const convo = state.convoList.find(c => c.convoId === convoId);
            console.log("Convo found:", convo);
            if(convo){
                convo.lastMsg = msg;
            } 
            console.log("setLastMessage:", convo);
            console.log("Before update lastMsg:", state.convoList);
            // state.convoList[convoId].lastMessage = msg;

        },
        updateLastTempMsgId :(state, action)=>{
            const { convoId, tempId, newId } = action.payload;
            // console.log("updateTempMsgId called with:", { convoId, tempId, newId });
            // console.log("Before update:", state.messageList[convoId]);
            // console.log("Before update lastMsg:", state.convoList);
            console.log("convoid received", convoId);
            const convo = state.convoList.find(c=> c.convoId===convoId);
            if(convo && convo.lastMsg && convo.lastMsg._id === tempId){
                convo.lastMsg._id = newId;
            }
        },
        markLastMsgDelivered: (state, action)=>{
            const { msgId, receiver, activeConvoId_otherSide } = action.payload;
            const convo = state.convoList.find(c => c.lastMsg && c.lastMsg._id === msgId);
            if (!convo || !convo.lastMsg) return;

            const msg = convo.lastMsg;
            if (msg._id === msgId) {
                if (!msg.deliveredTo) msg.deliveredTo = [];
                if (!msg.readBy) msg.readBy = [];

                // add receiver if not present in deliveredTo
                if (!msg.deliveredTo.includes(receiver)) {
                    msg.deliveredTo.push(receiver);
                }

                // also mark as read if receiver is actively viewing
                // if (!msg.readBy.includes(receiver) && activeConvoId_otherSide === convo.convoId) {
                //     msg.readBy.push(receiver);
                // }
            }
        },
        markLastMsgRead: (state, action)=>{
            const { activeConvoId_otherSide, sender } = action.payload
            const convo = state.convoList.find(c=> c.convoId===activeConvoId_otherSide)
            if(!convo || !convo.lastMsg) return;

            const msg = convo.lastMsg
            if(!msg.readBy) msg.readBy = [];

            // add receiver if not present
            if(!msg.readBy.includes(sender)){
                msg.readBy.push(sender)
            }
        },
        markUserOffline: (state, action)=>{
            const { user } = action.payload;
            const convo = state.convoList.find(c=>c.participants.some(p=>p._id===user));
            if(!convo) return;
            const formattedTime = new Date().toLocaleTimeString("en-US", { hour:"2-digit", minute:"2-digit", hour12:true });
            if (convo.lastSeen !== undefined) {
                convo.lastSeen = formattedTime;
            }
        },
        resetAllTyping: (state) =>{
            state.convoUserTyping = {};
        },
        clearConvoState: (state) =>{
            state.convoList = [] 
            state.activeConvoId = null 
            state.prevConvoId = null
            state.convoUserTyping = {}
            state.prevParticipants = []
            state.activeParticipants = []
        }
    }
});

export const { 
    setActiveConvo,
    setConvos,
    convoTypingUser,
    setLastMessage,
    updateLastTempMsgId,
    markLastMsgDelivered,
    markLastMsgRead,
    markUserOffline,
    resetAllTyping,
    clearConvoState,
} = convoSlice.actions;

export default convoSlice.reducer;
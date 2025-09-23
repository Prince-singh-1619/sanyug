import React, { useEffect } from 'react'
import { connectSocket, getSocket } from './socket';
import { addNewConvo, clearConvoState } from '../redux/slices/convoSlice';
import { useDispatch, useSelector } from 'react-redux';
import { clearChatState } from '../redux/slices/chatSlice';

connectSocket();
const socket = getSocket();

const ConvoEvents = () => {
    const dispatch = useDispatch()

    const userData = JSON.parse(localStorage.getItem("userData"))
    const userId = userData?._id

    const { activeParticipants } = useSelector(state => state.convo);


    const formatChatTimestamp = (dateString) =>{
        if (!dateString) return "";

        const date = new Date(dateString);
        const now = new Date();

        // Helper to zero out time for date comparison
        const stripTime = d => new Date(d.getFullYear(), d.getMonth(), d.getDate());

        const today = stripTime(now);
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const messageDate = stripTime(date);

        if (messageDate.getTime() === today.getTime()) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (messageDate.getTime() === yesterday.getTime()) {
        return 'Yesterday';
        } else {
        // Older -> show date
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }
    }

    // on refresh/reconnect, inform server about my activeConvoId again
    useEffect(()=>{
        const handleBeforeUnload = () =>{
            dispatch(clearChatState());
            dispatch(clearConvoState());
            socket.emit("active-convo-id", ({ sender:userId, activeConvoId:null, prevParticipants:activeParticipants, activeParticipants:[] }));
        }
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [socket, userId, activeParticipants])

    useEffect(()=>{
        socket.on("new-convo-added-received", ({newConvoForB})=>{
            console.log("new-convo-added-received in frontend", newConvoForB)
            const convo=newConvoForB;

            let newConvo;
            if (convo.isGroup) {
                // Group chat
                newConvo = {
                    convoId: convo._id,
                    name: convo.groupName,
                    profilePic: convo?.groupImage || "",
                    lastMsg: convo?.lastMessage || null,
                    sender: convo?.lastMessage?.sender || null,
                    participants: convo.participants,
                    createdAt: convo?.lastMessage?.createdAt ? formatChatTimestamp(convo.lastMessage.createdAt) : formatChatTimestamp(convo.createdAt),
                    unreadCount: convo?.unreadCount || 0,
                };
            } else {
            // One-to-one chat
                const otherUser = convo.participants.find((p) => p._id !== userId);
                newConvo = {
                    convoId: convo._id,
                    name: `${otherUser.firstName} ${otherUser.lastName}`,
                    profilePic: otherUser?.profilePic || "",
                    lastMsg: convo?.lastMessage || null,
                    sender: convo?.lastMessage?.sender || null,
                    participants: convo.participants,
                    lastSeen: formatChatTimestamp(otherUser.lastSeen),
                    createdAt: convo?.lastMessage?.createdAt ? formatChatTimestamp(convo.lastMessage.createdAt) : formatChatTimestamp(convo.createdAt),
                    unreadCount: convo?.unreadCount || 0,
                };
            }

            dispatch(addNewConvo( { newConvo } ))
        })

        return () => {
            socket.off("new-convo-added-received"); // cleanup
        };
    }, [dispatch, socket])
  return null
}

export default ConvoEvents
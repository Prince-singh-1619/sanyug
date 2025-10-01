import React, { useEffect } from 'react'
import { connectSocket, getSocket } from './socket';
import { addNewConvo } from '../redux/slices/convoSlice';
import { useDispatch, useSelector } from 'react-redux';
import { setOnlineUsers, addOnlineUser, removeOnlineUser } from '../redux/slices/onlineUsersSlice';

connectSocket();
const socket = getSocket();

const ConvoEvents = () => {
    const dispatch = useDispatch()

    const { userData } = useSelector(state => state.user)
    const userId = userData?._id

    // const { onlineUsers } = useSelector(state => state.onlineUsers);


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

    useEffect(()=>{
        socket.emit("get-online-users");
        
        socket.on("all-online-users", (users)=>{
            dispatch(setOnlineUsers(users))
        })
        socket.on("user-online", (userId)=>{
            dispatch(addOnlineUser(userId))
        })
        socket.on("user-offline", (userId)=>{
            dispatch(removeOnlineUser(userId))
        })

        return () =>{
            socket.off("all-online-users")
            socket.off("user-online")
            socket.off("user-offline")
        }
    }, [dispatch])



  return null
}

export default ConvoEvents
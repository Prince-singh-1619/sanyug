import React from 'react'
import { useDispatch } from 'react-redux';
import { connectSocket, getSocket } from './socket';
import { useEffect } from 'react';
import { convoTypingUser, resetAllTyping } from '../redux/slices/convoSlice';

connectSocket();
const socket = getSocket();

const TypingEvents = () => {
    const dispatch = useDispatch()

    useEffect(()=>{
        socket.on("typing", ({sender, convoId})=>{
            dispatch(convoTypingUser({ sender, convoId, isTyping:true }));
        })
        socket.on("stoppedTyping", ({sender, convoId})=>{
            dispatch(convoTypingUser({ sender, convoId, isTyping:false }));
        })
        socket.on("disconnect", ()=>{
            dispatch(resetAllTyping());
        })
        
        return () =>{
            socket.off("typing");
            socket.off("stoppedTyping");
            socket.off("disconnect");
        }
    }, [dispatch, socket])
    


    return null
}

export default TypingEvents
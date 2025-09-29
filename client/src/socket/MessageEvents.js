import React, { useEffect } from "react";
import { connectSocket, getSocket } from "./socket";
import { addMessage, deleteMessage, markMessageAsRead, markMessageDelivered } from "../redux/slices/chatSlice";
import { useDispatch, useSelector } from "react-redux";
import { markLastMsgDelivered, markLastMsgRead, markUserOffline, setLastMessage, updateUnreadCount } from "../redux/slices/convoSlice";
import { decryptMessage } from "../helpers/cryption";
import new_msg from '../assets/notify 3.mp3'
import new_notification from '../assets/notify 1.mp3'

connectSocket();
const socket = getSocket();

const MessageEvents = () => {
    const dispatch = useDispatch()

    // const userData = JSON.parse(localStorage.getItem("userData"));
    const { userData } = useSelector(state => state.user)
    const userId = userData?._id;
    console.log("userId in messageEvents:", userId)

    const { activeConvoId, prevParticipants, activeParticipants } = useSelector(state => state.convo);
    const { activeConvoId_otherSide } = useSelector(state=> state.chat);
    const { isSound } = useSelector(state => state.settings)
    // console.log("MessageEvents activeConvoId:", activeConvoId);

    // for receiver
    useEffect(() => {
        socket.on("new-message-received", async(msg) => {
            console.log("msg received", msg);
            const plainText = await decryptMessage(msg.text, msg.conversationId);
            const orgMsg =  {...msg, text: plainText, }// replace encrypted with decrypted
            
            console.log( "convoId being used:", msg.conversationId, typeof msg.conversationId );
            if(isSound && msg.conversationId===activeConvoId){
                console.log("is Read", msg.conversationId===activeConvoId)
                new Audio(new_msg).play().catch((err)=>console.log("Sound coundn't play: ", err))
            }
            if(isSound && msg.conversationId!==activeConvoId){
                console.log("is delivered", msg.conversationId!==activeConvoId)
                new Audio(new_notification).play().catch((err)=>console.log("Sound coundn't play: ", err))
            }

            dispatch(addMessage({ message: orgMsg }));
            dispatch(updateUnreadCount({convoId:orgMsg.conversationId, activeConvoId_otherSide}))
            dispatch(setLastMessage({ convoId: orgMsg.conversationId, msg:orgMsg }));
            // receiver to sender
            socket.emit("message-delivered", ({ msgId:orgMsg._id, sender:orgMsg.sender, receiver:userId, activeConvoId}));
            console.log("message-delivered emitted from receiver");
        });
        return () => {
            socket.off("new-message-received");
        };
    }, [dispatch, userId, activeConvoId]);

    // for sender - confirmation
    useEffect(() => {
        socket.on("message-delivery-confirmed", ({ msgId, receiver }) => {
            console.log( "msg sent confirmed by server. msgId:", msgId, "receiver:", receiver );
            console.log("my Id:", userId);
            // tempId taken care in http success itself
            dispatch(markMessageDelivered({ msgId, receiver }));
            dispatch(markLastMsgDelivered({ msgId, receiver, activeConvoId_otherSide }))
            console.log("markMessageDelivered dispatched from client");
        });
        return () => {
            socket.off("message-delivery-confirmed");
        };
    }, [dispatch, userId]);

    useEffect(()=>{
        socket.on("message-read-confirmed", ({reader, convoId})=>{
            console.log("message-read-confirmed received at sender")
            console.log("reader", reader, ", convoId", convoId)
            dispatch(markMessageAsRead({reader, convoId}))
            dispatch(markLastMsgRead({reader, convoId}))
        })

        return () => socket.off("message-read-confirmed")
    })

    // inform server about my activeConvoId change
    // useEffect(()=>{
    //     // console.log("active convoId before emitting: ", activeConvoId)
    //     // send activeConvoId to all participants to server
    //     socket.emit("active-convo-id", ({ sender:userId, activeConvoId, prevParticipants, activeParticipants }));
    // }, [activeConvoId, socket, userId])

    // // participant-left-active & participant-joined-active
    // useEffect(() => {
    //     const handleLeft = ({ activeConvoId_otherSide, sender }) => {
    //         console.log("participant-left-active received", activeConvoId_otherSide);
    //         dispatch(markMessageAsRead({ activeConvoId_otherSide, sender }));
    //         dispatch(markLastMsgRead({ activeConvoId_otherSide, sender }));
    //         dispatch(markUserOffline({ user: sender }))
    //     };

    //     const handleJoined = ({ activeConvoId_otherSide, sender }) => {
    //         console.log("participant-joined-active received", activeConvoId_otherSide);
    //         dispatch(markMessageAsRead({ activeConvoId_otherSide, sender }));
    //         dispatch(markLastMsgRead({ activeConvoId_otherSide, sender }));
    //     };

    //     socket.on("participant-left-active", handleLeft);
    //     socket.on("participant-joined-active", handleJoined);

    //     return () => {
    //         socket.off("participant-left-active", handleLeft);
    //         socket.off("participant-joined-active", handleJoined);
    //     };
    // }, [socket, dispatch]);

    // on message deletion
    useEffect(()=>{
        socket.on("message-delete-received", ({msgId, convoId})=>{
            dispatch(deleteMessage({msgId, convoId}));
        })
        return () => socket.off("message-delete-received")
    })

    return null;
};

export default MessageEvents;
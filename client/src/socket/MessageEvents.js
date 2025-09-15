import React, { useEffect } from "react";
import { connectSocket } from "./socket";
import { addMessage, markMessageAsRead, markMessageDelivered } from "../redux/slices/chatSlice";
import { useDispatch, useSelector } from "react-redux";
import { markLastMsgDelivered, markLastMsgRead, markUserOffline, setLastMessage } from "../redux/slices/convoSlice";

const socket = connectSocket();

const MessageEvents = () => {
    const dispatch = useDispatch()

    const userData = JSON.parse(localStorage.getItem("userData"));
    const userId = userData?.userId;

    const { activeConvoId, prevParticipants, activeParticipants } = useSelector(state => state.convo);
    const { activeConvoId_otherSide } = useSelector(state=> state.chat);
    // console.log("MessageEvents activeConvoId:", activeConvoId);

    // const { convoList } = useSelector((state)=>state.convo)
    // const activeConvo = convoList.find(c => c.convoId === activeConvoId);
    // const participants = activeConvo ? activeConvo.participants.map(p => p._id) : [];
    // console.log("participants in MessageEvents:", participants);

    // for receiver
    useEffect(() => {
        socket.on("new-message-received", (msg) => {
            console.log("msg received", msg);
            // console.log( "convoId being used:", msg.conversationId, typeof msg.conversationId );

            dispatch(addMessage({ message: msg }));
            dispatch(setLastMessage({ convoId: msg.conversationId, msg }));
            // dispatch(markMessageAsRead)
            // receiver to sender
            socket.emit("message-delivered", { msgId:msg._id, sender:msg.sender, receiver:userId, activeConvoId});
            console.log("message-delivered emitted from receiver");
        });
        return () => {
            socket.off("new-message-received");
        };
    }, [dispatch, userId]);

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

    // inform server about my activeConvoId change
    useEffect(()=>{
        // console.log("active convoId before emitting: ", activeConvoId)
        // send activeConvoId to all participants to server
        // socket.emit("active-convo-id", ({ sender:userId, participants, activeConvoId }));
        socket.emit("active-convo-id", ({ sender:userId, activeConvoId, prevParticipants, activeParticipants }));
    }, [activeConvoId, socket, userId])

    // on refresh/reconnect, inform server about my activeConvoId again
    useEffect(()=>{
        const handleBeforeUnload = () =>{
            socket.emit("active-convo-id", ({ sender:userId, activeConvoId:null, prevParticipants:activeParticipants, activeParticipants:[] }));
        }
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [socket, userId, activeParticipants])


    // participant-left-active & participant-joined-active
    useEffect(() => {
        const handleLeft = ({ activeConvoId_otherSide, sender }) => {
            console.log("participant-left-active received", activeConvoId_otherSide);
            dispatch(markMessageAsRead({ activeConvoId_otherSide, sender }));
            dispatch(markLastMsgRead({ activeConvoId_otherSide, sender }));
            dispatch(markUserOffline({ user: sender }))
        };

        const handleJoined = ({ activeConvoId_otherSide, sender }) => {
            console.log("participant-joined-active received", activeConvoId_otherSide);
            dispatch(markMessageAsRead({ activeConvoId_otherSide, sender }));
            dispatch(markLastMsgRead({ activeConvoId_otherSide, sender }));
        };

        socket.on("participant-left-active", handleLeft);
        socket.on("participant-joined-active", handleJoined);

        return () => {
            socket.off("participant-left-active", handleLeft);
            socket.off("participant-joined-active", handleJoined);
        };
    }, [socket, dispatch]);


    return null;
};

export default MessageEvents;
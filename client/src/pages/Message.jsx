import React, { useEffect, useRef, useState } from 'react'
import dummyDp from '../assets/person-dummy.svg'
import { SlOptionsVertical } from "react-icons/sl";
import { LuTextSearch } from "react-icons/lu";
import { TbCloudUpload } from "react-icons/tb";
import { FaPersonWalkingArrowRight } from "react-icons/fa6";
import { IoSend } from "react-icons/io5";
import { BsEmojiSmile } from "react-icons/bs";
import { MdAttachFile, MdDelete } from "react-icons/md";
import SummaryApi from '../helpers/SummaryApi';
import { toast } from 'react-toastify';
// import TextOutline from '../helpers/TextOutline';
import { HiRefresh } from "react-icons/hi";
import { AiOutlineSelect } from 'react-icons/ai';
import socket from '../helpers/socket'
import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";
import ChatDropdown from '../components/ChatDropdown';
// import { useLocation } from 'react-router-dom';
dayjs.extend(calendar);
import { useDispatch, useSelector } from "react-redux";
import { addMessage, setMessages, deleteMessage, updateTempMsgId } from "../redux/slices/chatSlice";
import DeleteConfirm from '../popups/DeleteConfirm';

const Message = () => {
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  // const [messageList, setMessageList] = useState([])
  // const list = messageList
  const [chatDropdown, setChatDropdown] = useState(false)
  const [typingUser, setTypingUser] = useState(null)
  // const [deleteBox, setDeleteBox] = useState(false)
  const [deleteMsgId, setDeleteMsgId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false)

  // const location = useLocation();
  // const activeChat = location.state?.activeChat;

  const dispatch = useDispatch()
  const {activeChat, activeConvoId, messageList} = useSelector((state)=>state.chat)

  const convoId = activeConvoId
  // const convoId = activeChat?.convoId
  const authToken = localStorage.getItem("authToken");
  const userData = JSON.parse(localStorage.getItem("userData"))
  const userId = userData?.userId
  
  // const me = true
  // const me = false
  // const me = list?.sender===userId ? true : false

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = async() => {
    // const newMessage = { sender:userId, text:message, createdAt:Date.now() };
    // console.log("newMessage: ", newMessage)
    
    const tempId = Date.now().toString();
    dispatch(addMessage({
      convoId,
      message: {
        _id: tempId,              // temporary id
        text: message,         // the message text
        sender: userId,           // current user
        isTemp: true,             // mark as not confirmed yet
        createdAt: new Date().toISOString()
      }
    }));

    if (message.trim() || selectedFile) {
      console.log('Sending message:', message);
      console.log('Selected file:', selectedFile);

      const payload = {
        convoId,
        sender: userId,
        text: message,
        media: selectedFile || null,
        isRead: false,
        // createdAt: new Date().toISOString()
      }

      const res = await fetch(SummaryApi.sendMessage.url, {
        method: SummaryApi.sendMessage.method,
        headers:{
          'Content-type' : 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload)
      })

      const resData = await res.json();
      if(resData.success){
        toast.success("done",resData.message)
        // Emit live events to other clients
        dispatch(updateTempMsgId({ convoId, tempId, newId:resData.data._id }));
        socket.emit("sendMessage", payload)
        
        // setMessageList((prev)=>[...prev, payload])
      }
      else{
        toast.warning(resData.message)
      }
      
      setMessage('');
      setSelectedFile(null);
    }
  };

  const handleGetMessages = async() =>{
    console.log("fetching messages..")
    console.log("convoId in message:", convoId)
    try { 
      const res = await fetch(`${SummaryApi.fetchMessage.url}?convoId=${convoId}&userId=${userId}`, {
        method: SummaryApi.fetchMessage.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      })

      const resData = await res.json()
      if(resData.success){
        console.log("MessageList", resData.data)
        // setMessageList(resData.data)
        dispatch(setMessages({convoId, messages:resData.data})) //store in redux
        toast.success(resData.message)
      }
      else{
        toast.warning(resData.message)
      }
    } 
    catch (error) {
      console.error("Failed to fetch messages", error);
      toast.error("Failed to fetch messages");
    }
  }

  useEffect(()=>{
    // if(activeChat && Object.keys(activeChat).length > 0){
    if(activeChat && convoId){
    // if(convoId && !messageList){
      handleGetMessages()
    }

    socket.on("receiveMessage", (data)=>{
      if(data.convoId===convoId){
        // setMessageList((prev) => [...prev, data])
        dispatch(addMessage({convoId, message:data}))
      }
    })
    return () => socket.off("receiveMessage")
  }, [activeChat])
  // }, [])

  const formatChatTimestamp = (dateString) =>{
    const date = new Date(dateString);
    const now = new Date();

    // Helper to zero out time for date comparison
    const stripTime = d => new Date(d.getFullYear(), d.getMonth(), d.getDate());

    const today = stripTime(now);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const messageDate = stripTime(date);

    // if (messageDate.getTime() === today.getTime()) {
      // Today → show time
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    // }
  }
  function groupMessagesByDate(messages=[]) {
    const grouped = {};

    messages.forEach((msg) => {
      if (!msg || !msg.createdAt) return; // skip bad entries
      const dateKey = dayjs(msg.createdAt).format("YYYY-MM-DD");
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(msg);
    });

    return grouped;
  }

  const bottomRef = useRef(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageList]); // runs whenever messageList updates

  // const handleDelete = async(msgId) =>{
  //   console.log("deleting...", msgId)
  //   setIsDeleting(true)
  //   try {
  //     const res = await fetch(SummaryApi.deleteMessage.url, {
  //       method: SummaryApi.deleteMessage.method,
  //       headers: { 
  //         "Content-Type": "application/json",
  //         'Authorization': `Bearer ${authToken}`,
  //       },
  //       body: JSON.stringify({ msgId }),
  //     })
  //     const resData = await res.json();
  //     if (resData.success) {
  //       toast.success(resData.message)
  //       console.log("Message deleted");
  //       // No need to update UI here, socket will handle it
  //       dispatch(deleteMessage({msgId, updatedText:"This message has been deleted"}))
  //     }
  //   } catch (error) {
  //     console.error("Error deleting message", error)
  //   }
  //   finally{
  //     setIsDeleting(false)
  //     setDeleteBox(false)
  //   }
  // }

  // useEffect(() => {
  //   // socket.on("messageDeleted", (data) => {
  //     // dispatch(deleteMessage({msgId:data.msgId, updatedText:data.updatedText || "This message has been deleted"}))
  //     // setMessageList((prev) =>
  //     //   prev.map((msg) =>
  //     //     msg._id === data.msgId ? { ...msg, text: data.updatedText } : msg
  //     //   )
  //     // );
  //   });

  //   return () => socket.off("messageDeleted");
  // }, []);

  useEffect(()=>{
    socket.on("userstatus", ({userId, status, lastSeen})=>{
      // update UI 
    })
  })

  useEffect(() => {
    socket.on("typing", ({ userId }) => {
      setTypingUser(userId);
    });

    socket.on("stopTyping", ({ userId }) => {
      if (typingUser === userId) setTypingUser(null);
    });

    return () => {
      socket.off("typing");
      socket.off("stopTyping");
    };
  }, [typingUser]);

  // When user types in input box
  const handleTyping = (e) => {
    setMessage(e.target.value);

    socket.emit("typing", { convoId, userId });

    clearTimeout(window.typingTimeout);
    window.typingTimeout = setTimeout(() => {
      socket.emit("stopTyping", { convoId, userId });
    }, 1000); // stops typing after 1s of inactivity
  };


// console.log("messageList", messageList)


  return (
    <section className='w-full h-[99vh] max-h-screen flex flex-col  rounded-lg border border-slate-400 shadow-sm'>
      {/* Header */}
      <header className='h-16 w-full px-4 py-3 flex justify-between items-center bg-gray-400 dark:bg-gray-600 border-b border-gray-200 dark:border-gray-700 rounded-t-lg'>
        <div className='flex items-center gap-3 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors'>
          <img src={activeChat?.profilePic || dummyDp} alt='Profile' className='w-10 h-10 object-cover rounded-full border-2 border-gray-200 dark:border-gray-800' />
          <div className='flex flex-col'>
            <p className='font-semibold text-gray-900 dark:text-white text-sm capitalize'>{activeChat?.name}</p>
            <span className='text-xs text-green-600 dark:text-green-400 flex items-center gap-1'>
              <div className='w-2 h-2 bg-green-500 rounded-full'></div>
              {/* Online  */}
              {/* {user.status==='online' ? "Online" : `Last seen at ${new Date(user.lastSeen).toLocaleTimeString}`} */}
              {activeChat?.status=='online' ? "Online" : ` Last seen at ${new Date(activeChat?.lastSeen).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`}
              {typingUser && typingUser!==userId && (
                <p className='text-sm text-gray-500'>Typing...</p>
              )}
            </span>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <button onClick={handleGetMessages} className='p-2 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-lg transition-colors'>
            <HiRefresh className='text-lg' />
          </button>
          <button className='p-2 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-lg transition-colors'>
            <LuTextSearch className='text-lg' />
          </button>
          <button onClick={()=>setChatDropdown((prev)=>!prev)} className='p-2 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-lg transition-colors'>
            <SlOptionsVertical className='text-lg' />
          </button>
          <div className='absolute z-50'>{chatDropdown && (<ChatDropdown/>)}</div>
          
        </div>
      </header>

      {/* Messages Area */}
      <div className='flex-1 w-full p-1 overflow-y-auto '>
        {!messageList && <div className='flex flex-col items-center justify-center h-full text-center'>
          <div className='w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4'>
            <AiOutlineSelect className='text-2xl text-gray-500 dark:text-gray-400' />
          </div>
          <h3 className='text-lg font-medium mb-2'>
            Select a conversation
          </h3>
          <p className='text-sm  max-w-sm'>
            Choose a conversation from the sidebar to start messaging
          </p>
         </div>
        }

        <div className="w-full h-full flex flex-col mt-2 mb-4">
          {Object.entries(groupMessagesByDate(messageList[convoId] || [])).map(([date, msgs]) => (
            <div key={date}>
              {/* Date Divider */}
              <div className="flex justify-center my-3">
                <span className="combine-bg-2 px-3 py-1 rounded text-xs">
                  {dayjs(date).calendar(null, {
                    sameDay: "[Today]",
                    lastDay: "[Yesterday]",
                    lastWeek: "dddd",
                    sameElse: "DD MMM YYYY",
                  })}
                </span>
              </div>

              {/* Messages */}
              {msgs.map((data, index) => (
                <div key={index} className={`group mb-2 px-2 ${data.sender===userId ? "place-items-end" : "place-items-start" }`}>
                  <div className={` relative flex w-fit max-w-[80%] h-fit text-lg font-medium border py-1 px-2 rounded-md ${data.sender===userId ? "rounded-br-none" : "rounded-bl-none"} bg-green-400 dark:bg-green-700 `}>
                    <p className={`${data.isRemoved ? 'italic text-red-800 dark:text-red-600 opacity-75':''}`}>{data.text} </p>
                    <span className="text-xs opacity-85 min-w-16 max-h-6 flex justify-center items-center mt-auto place-items-end-safe">{formatChatTimestamp(data.createdAt)}</span> 
                    {/* <i className={`absolute top-1/3 h-8 w-8 text-2xl bg-red-500 hover:bg-red-600 hover:cursor-pointer rounded-full flex justify-center items-center ${data.sender===userId ? 'block':'hidden'}`}><MdDelete /></i> */}
                    {data.sender === userId && (
                      <i onClick={()=>!data.isTemp && setDeleteMsgId(data._id)} 
                          className={`absolute top-1/2 -left-10 transform -translate-y-1/2 hidden 
                          ${data.isTemp ? 'cursor-not-allowed' : 'cursor-pointer'} 
                          ${data.isRemoved ? 'hidden':'group-hover:flex'} h-8 w-8 text-2xl bg-red-500 hover:bg-red-600 rounded-full justify-center items-center`}> 
                        {isDeleting && deleteMsgId===data._id ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <MdDelete/>
                        )}
                      </i>
                      )
                    }
                  </div>
                  {/* <span className="text-xs opacity-85 mr-1 flex place-items-end">{formatChatTimestamp(data.createdAt)}</span> */}
                </div>
              ))}
            </div>
          ))}
          <div ref={bottomRef}/>
          {deleteMsgId!==null && (
            <DeleteConfirm msgId={deleteMsgId} open={deleteMsgId!==null} setOpen={()=>setDeleteMsgId(null)}/>
          )}
        </div>
      </div>

      {/* Footer - Message Input */}
      <footer className='h-20 w-full p-4 bg-gray-400 dark:bg-gray-600 border-t border-gray-200 dark:border-gray-700 rounded-b-lg'>
        <div className='flex items-center gap-3'>
          {/* File Upload */}
          <div className='flex items-center gap-2'>
            <input 
              id='addFiles' 
              type='file' 
              className='hidden'
              onChange={handleFileChange}
              accept="image/*,.pdf,.doc,.docx,.txt"
            />
            <label 
              htmlFor='addFiles' 
              className='p-2 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors'
              title="Attach file"
            >
              <TbCloudUpload className='text-xl' />
            </label>
            <button 
              className='p-2 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-lg transition-colors'
              title="Add emoji"
            >
              <BsEmojiSmile className='text-xl' />
            </button>
          </div>

          {/* Message Input */}
          <div className='flex-1 relative'>
            <textarea
              value={message}
              onChange={handleTyping}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className='input-field w-full p-3 pr-12 rounded-lg focus:ring-2 '
              rows="1"
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
            {selectedFile && (
              <div className='absolute -top-2 left-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full flex items-center gap-1'>
                <span>{selectedFile.name}</span>
                <button 
                  onClick={() => setSelectedFile(null)}
                  className='text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100'
                >
                  ×
                </button>
              </div>
            )}
          </div>

          {/* Send Button */}
          <button
            onClick={handleSendMessage}
            disabled={!message.trim() && !selectedFile}
            className='p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg transition-colors disabled:cursor-not-allowed flex items-center justify-center'
            title="Send message"
          >
            <IoSend className='text-lg' />
          </button>
        </div>
      </footer>
    </section>
  )
}

export default Message
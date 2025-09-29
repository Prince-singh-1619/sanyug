import React, { useEffect, useRef, useState } from 'react'
import dummyDp from '../assets/person-dummy.svg'
import { SlOptionsVertical } from "react-icons/sl";
import { LuTextSearch } from "react-icons/lu";
import { TbCloudUpload } from "react-icons/tb";
import { IoAttach, IoSend } from "react-icons/io5";
import { BsEmojiSmile } from "react-icons/bs";
import { MdAttachFile, MdDelete } from "react-icons/md";
import SummaryApi from '../helpers/SummaryApi';
// import { toast } from 'react-toastify';
import { HiRefresh } from "react-icons/hi";
import { AiOutlineSelect } from 'react-icons/ai';
import { connectSocket, getSocket } from '../socket/socket';
import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";
import ChatDropdown from '../components/ChatDropdown';
dayjs.extend(calendar);
import { useDispatch, useSelector } from "react-redux";
import { addMessage, setActiveChat, setMessages, updateTempMsgId } from "../redux/slices/chatSlice";
import DeleteConfirm from '../popups/DeleteConfirm';
import MsgIndicator from '../components/MsgIndicator';
import { toast } from 'react-hot-toast';
import { setActiveConvo, setLastMessage, updateLastTempMsgId } from '../redux/slices/convoSlice';
import EmojiPicker from "emoji-picker-react"
import { motion, AnimatePresence } from "framer-motion";
import { encryptMessage, decryptMessage } from '../helpers/cryption'
import { IoMdArrowBack, IoMdClose } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';
import sentSound from '../assets/notify 2.mp3'
import defaultDoodleBg from '../assets/1.png'
import NextUserProfile from '../popups/NextUserProfile';
// import defaultDoodleBg from '../assets/doodle-2.png'

// connectSocket()

const Message = () => {
  
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [chatDropdown, setChatDropdown] = useState(false)
  // const [deleteBox, setDeleteBox] = useState(false)
  const [deleteMsgId, setDeleteMsgId] = useState(null);
  // const [deleteMediaId, setDeleteMediaId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false)
  // const [showUnreadDivider, setShowUnreadDivider] = useState(false)
  const [firstUnreadId, setFirstUnreadId] = useState(null)
  const [unreadNumber, setUnreadNumber] = useState(0)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [chatTheme, setChatTheme] = useState(localStorage.getItem("theme"))
  const pickerRef = useRef(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark")
  const [showDetails, setShowDetails] = useState(false);
  const [isOnline, setIsOnline] = useState(false);

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const onlineUsers = useSelector(state => state.onlineUsers?.onlineUsers)
  const { activeChat, messageList } = useSelector((state)=>state.chat)
  const { activeConvoId, convoList, convoUserTyping } = useSelector(state => state.convo);
  const userLastSeen = convoList.find(c=>c.convoId===activeConvoId).lastSeen
  // console.log("convoList[activeConvoId].lastSeen", convoList[activeConvoId].lastSeen)

  const convoId = activeConvoId

  // const authToken = localStorage.getItem("authToken");
  // const userData = JSON.parse(localStorage.getItem("userData"))
  const { authToken, userData } = useSelector(state => state.user)
  const userId = userData?._id
  const { isSound, isDefaultBg, chatBgWallpaper } = useSelector(state => state.settings)

  const typingUser = convoUserTyping[activeConvoId] || [] 
  const isTyping = typingUser.some(id => id !== userId);
  
  // const socket = connectSocket();
  const socket = getSocket();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleFileUpload = async(media) =>{
    if(!media) return

    try {
      const formData = new FormData()
      formData.append("file", selectedFile)
  
      const res = await fetch(SummaryApi.sendMedia.url, {
        method:SummaryApi.sendMedia.method,
        headers: {
          Authorization: `Bearer ${authToken}`
        },
        body: formData
      })
  
      const resData = await res.json();
      console.log("File uploaded", resData)
      return resData
    } catch (error) {
      toast.error("Error uploading highRes DP")
      console.log(error)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = async() => {
    if (!message.trim() && !selectedFile) return;
    // const newMessage = { sender:userId, text:message, createdAt:Date.now() };
    // console.log("newMessage: ", newMessage)
    
    const tempId = Date.now().toString();
    const baseMsg = {
      conversationId: convoId,
      _id: tempId,              // temporary id
      text: message.trim() ? message : null,         // the message text
      media: selectedFile ? {
            type: selectedFile.type.startsWith("image") ? "image" : "file",
            url: URL.createObjectURL(selectedFile),  // temp preview before upload
            publicId: null, // update after uploading
            originalName: selectedFile.name,
        } : null, 
      sender: userId,           // current user
      isTemp: true,   
      // give a totalReceiver here, to properly show msg status
      deliveredTo: [],
      readBy: [],          // mark as not confirmed yet
      createdAt: new Date().toISOString()
    }
    dispatch(addMessage({ message: baseMsg }));
    dispatch(setLastMessage({ msg:{ 
        ...baseMsg, 
        text: baseMsg.text || "File attached"
      }
    }))

    const media = selectedFile;
    setMessage('');
    setSelectedFile(null);
    
    const encrypted = await encryptMessage(message, convoId)
    console.log("encrypted:", encrypted)
    
    let mediaPayload = null;
    if(selectedFile){
      const uploadMedia = await handleFileUpload(media);
      if(uploadMedia?.url){
        mediaPayload = { 
          type:selectedFile.type.startsWith("image") ? "image" : "file", 
          url:uploadMedia.url, 
          publicId: uploadMedia.publicId,
          filename:uploadMedia.originalName 
        }
      }
    }

    const payload = {
      convoId,
      sender: userId,
      text: message.trim() ? encrypted : null,
      media: mediaPayload,
      // totalReceivers: activeChat?.isGroup ? (activeChat?.members?.length -1) : 1,
      // deliveredTo: [],
      // readBy: [],
      // isRead: false,
      // createdAt: new Date().toISOString()
    }

 

    // using react hot toast here
    const res = await toast.promise( fetch(SummaryApi.sendMessage.url, {
      method: SummaryApi.sendMessage.method,
      headers:{
        'Content-type' : 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(payload)
      }), 
      {
        error: "Failed to send message"
      }
    );
    // turn response into error if not ok
    if (!res.ok) {
      throw new Error(`Request failed with status ${res.status}`);
    }

    const resData = await res.json();
    if(resData.success){
      if(isSound) new Audio(sentSound).play().catch((err) => console.log("Sent audio play error: ", err));
      // toast.success(resData.message)
      // Emit live events to other clients
      dispatch(updateTempMsgId({ convoId, tempId, newId:resData.data._id, newPublicId:resData.data?.media?.publicId }));
      dispatch(updateLastTempMsgId({ convoId, tempId, newId:resData.data._id }))
    }
    else{
      // toast.warning(resData.message)
    }
    
  };

  const decryptAllMessages = async(messages, convoId) => {
    const decrypted = await Promise.all(
      messages.map(async (msg) => {
        const plainText = await decryptMessage(msg.text, convoId);
        return {
          ...msg,
          text: plainText, // replace encrypted with decrypted
        };
      })
    );
    return decrypted;
  }

  const handleGetMessages = async() =>{
    console.log("fetching messages..")
    console.log("convoId in message:", convoId)
    try { 
      const res = await toast.promise(fetch(`${SummaryApi.fetchMessage.url}?convoId=${convoId}&userId=${userId}`, {
        method: SummaryApi.fetchMessage.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        }
      }),
      {
        loading: "fetching...",
        success: "Message fetched",
        error: "Failed to get message"
      }
    )

      const resData = await res.json()
      if(resData.success){
        const orgMsg = await decryptAllMessages(resData.data, convoId)
        // readMessages = resData.data.filter(m => m.readBy.includes(userId));
        // const unreadMessages = resData.data.filter(m => !m.readBy.includes(userId) && m.sender.toString() === userId);
        // console.log("readMessages", readMessages, "unreadMessages", unreadMessages)
        // console.log("MessageList from getMessages", resData.data)
        // dispatch(setMessages({convoId, messages:resData.data})) //store in redux
        dispatch(setMessages({convoId, messages:orgMsg})) //store in redux
        // toast.success(resData.message)
      }
      else{
        // toast.warning(resData.message)
      }
    } 
    catch (error) {
      console.error("Failed to fetch messages", error);
      // toast.error("Failed to fetch messages");
    }
  }

  useEffect(()=>{
    // if(activeChat && Object.keys(activeChat).length > 0){
    if(activeChat && convoId){
    // if(convoId && !messageList){
      handleGetMessages()
      // socket.emit("messageRead", {convoId, userId}) // mark all as read
    }
  }, [convoId])

  const formatChatTimestamp = (dateString) =>{
    const date = new Date(dateString);
    const now = new Date();

    // Helper to zero out time for date comparison
    const stripTime = d => new Date(d.getFullYear(), d.getMonth(), d.getDate());

    const today = stripTime(now);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    // const messageDate = stripTime(date);

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

  // scroll to bottom
  const bottomRef = useRef(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageList]); // runs whenever messageList updates

  // check if user is online
  useEffect(()=>{
    if (!activeChat) return;
    console.log("onlineUsers", onlineUsers)
    const otherUserIds = activeChat.participants.filter(p=> p._id!==userId).map(p=>p._id)
    const onlineStatus = otherUserIds.some(id=>onlineUsers.includes(id))
    setIsOnline(onlineStatus)
  }, [activeChat, userId])

  useEffect(()=>{
    const sender = activeChat?.participants.filter(p=> p._id!==userId).map(p=>p._id)
    socket.emit("message-read", ({convoId:activeConvoId, reader:userId, sender}))
    console.log("message-read emitted..")
    console.log("convoId ",activeConvoId, ", reader ", userId, ", sender:", sender)
  }, [activeConvoId, messageList[activeConvoId]?.length])

  // When user types in input box
  const typingTimeoutRef = useRef(null);
  const handleTyping = (value) => {
    setMessage(value);

    const convo = convoList.find(c=>c.convoId===activeConvoId)
    if(!convo) return;
    // console.log("convo for typing event", convo)
    const receivers = convo.participants.map(p=>p._id).filter(id=>id!==userId)
    console.log("receivers for typing event", receivers)

    if(!typingTimeoutRef.current){
      socket.emit("typing", {sender:userId, convoId:activeConvoId, receivers})
      console.log("typing emitted...........")
    }

    // clear old timer
    clearTimeout(typingTimeoutRef.current);
    // set new timer
    typingTimeoutRef.current = setTimeout(()=>{
      socket.emit("stoppedTyping", {sender:userId, convoId:activeConvoId, receivers})
      console.log("stoppedTyping")
      typingTimeoutRef.current = null;
    }, 1500)
  };

  const onEmojiClick = (emojiObject) =>{
    const newMessage = message + emojiObject.emoji
    handleTyping(newMessage);
  }

  // unread message count
  useEffect(()=>{
    if(messageList[activeConvoId]){
      const unread = messageList[activeConvoId].filter(m=>!m.readBy.includes(userId) && m.sender!==userId);
      
      if(unread.length>0){
        setFirstUnreadId(unread[0]._id)
        setUnreadNumber(unread.length)
      }else{
        // setShowUnreadDivider(false)
        setFirstUnreadId(null)
        setUnreadNumber(0)
      }
    }
  }, [activeConvoId])

  // for click outside emoji
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmojiPicker]);

  const handleBackNav = () =>{
    dispatch(setActiveChat({ chat: null }))
    dispatch(setActiveConvo({ newConvoId: null, participants: [] }) )
    navigate('/conversations')
  }

  // filter convos for search
  const filteredMessages = (messageList?.[convoId] || []).filter(msg => {
    if (!search?.trim()) return true; // if search is empty, show all

    const textMatch = msg?.text?.toLowerCase().includes(search.toLowerCase());
    const fileMatch = msg?.media?.filename?.toLowerCase().includes(search.toLowerCase());
    const localFileMatch = msg?.media?.originalName?.toLowerCase().includes(search.toLowerCase());

    return textMatch || fileMatch || localFileMatch;
  });

// console.log("final",messageList[convoId])
// console.log("activeChat", activeChat)


  return (
    <section className='w-full h-[99vh] max-h-screen flex flex-col  rounded-lg border border-slate-400 shadow-sm'>
      {/* Header */}
      <header className='h-16 w-full px-2 py-3 flex justify-between items-center bg-gray-300 dark:bg-gray-600 border-b border-gray-200 dark:border-gray-700 rounded-t-lg'>
        <div className='flex justify-center items-center'>
          <Link onClick={handleBackNav} className='hidden max-md:block p-2'> <IoMdArrowBack/> </Link> 
          <button onClick={()=>setShowDetails(true)} className='flex items-center gap-3  cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors'>
            <img src={activeChat?.profilePic?.lowResPic || dummyDp} alt='Profile' className='w-10 h-10 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-800' />
            <div className='flex flex-col items-start'>
              <p className='font-semibold text-gray-900 dark:text-white text-lg capitalize'>{activeChat?.name}</p>
              {/* Online  */}
              <span className={`text-xs ${isOnline ? 'text-green-600 dark:text-green-400' : 'opacity-85'}  flex items-center gap-1`}>
                {isOnline ? <div className='w-2 h-2 bg-green-500 rounded-full'></div> : ''}
                {isTyping ? (
                  "Typing..."
                  ) : (
                    isOnline ? "Online" : ` Last seen at ${userLastSeen}`
                )}
              </span>
            </div>
          </button>
        </div>

        <div className='relative flex items-center gap-2'>
          <button onClick={handleGetMessages} className='max-[425px]:hidden p-3 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-lg transition-colors'>
            <HiRefresh className='text-lg' />
          </button>
          <button onClick={()=>setIsSearchOpen(prev=>!prev)} className='max-[425px]:hidden p-3 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-lg transition-colors'>
            <LuTextSearch className='text-lg' />
          </button>
          {isSearchOpen && <input type='text' placeholder='Search in messages' value={search} onChange={(e)=>setSearch(e.target.value)} className='absolute z-50 top-10 right-0 w-78 h-12 px-2 bg-slate-300 dark:bg-[#151515] rounded-lg'/>}
          <button onClick={()=>setChatDropdown((prev)=>!prev)} className='p-3 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-lg transition-colors'>
            <SlOptionsVertical className='text-lg' />
          </button>
          <div className='absolute z-50 right-4 top-16 '>{chatDropdown && (<ChatDropdown/>)}</div>
          
        </div>

        <NextUserProfile user={activeChat} isOpen={showDetails} onClose={()=>setShowDetails(false)} />
      </header>

    {/* Messages Area */}
    <section className="relative flex-1 w-full h-1/2 p-1">
      {/* Background image*/}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <img src={isDefaultBg ? defaultDoodleBg : chatBgWallpaper} alt="chat" className={`w-full h-full object-cover ${isDefaultBg ? 'opacity-20 dark:opacity-10 invert-50 dark:invert-0' : 'opacity-15'}  pointer-events-none`} />
      </div>

      <div className={`relative flex-1 w-full h-full p-1  overflow-y-auto `}>
        {/* <img src={isDefaultBg ? defaultDoodleBg : chatBgWallpaper} alt='chat' className={`absolute top-0 left-0 w-full h-full object-cover opacity-20 dark:opacity-10 invert-50 dark:invert-0 pointer-events-none`} /> */}
        
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

        <div className="w-full h-full flex flex-col my-2">
          <span className='text-yellow-800 dark:text-yellow-300 w-fit mx-auto text-center bg-slate-300 dark:bg-[#151515] px-4 py-1 rounded-lg border'>Your messages on Sanyug are end to end encrypted</span>
          {Object.entries(groupMessagesByDate(filteredMessages || [])).map(([date, msgs]) => (
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
              {msgs.map((data, index) =>{ 
                const isFirstUnread = data._id===firstUnreadId
               return(
                <div key={data._id || index} className={`group mb-2 px-2 ${data.sender===userId ? "place-items-end" : "place-items-start" }`}>
                  {/* Unread divider */}
                  {isFirstUnread && unreadNumber>0 && (
                    <div className="w-1/2 flex justify-center items-center mx-auto text-nowrap my-2 bg-gray-800"> 
                      <span className="px-4 py-1 rounded-full  text-white text-sm">{unreadNumber} Unread Messages</span> 
                    </div>
                  )}                  

                  <div className={` relative flex flex-col w-fit max-w-[80%] h-fit text-lg font-medium border  rounded-md ${data.sender===userId ? "rounded-br-none bg-green-400 dark:bg-green-700" : "rounded-bl-none bg-slate-300 dark:bg-[#151515]"}  `}>
                    
                    {data.media && (
                      <section className='lazy-loading px-2'>
                        {data.media.type === "image" && (
                          <img  src={data.media.url}  alt="attachment"  className="w-36 h-36 object-cover rounded-lg max-w-xs cursor-pointer"/>
                        )}

                        {data.media.type === "video" && (
                          <video controls className="rounded-lg max-w-xs">
                            <source src={data.media.url} type="video/mp4" />
                            Your browser does not support video playback.
                          </video>
                        )}

                        {data.media.type === "audio" && (
                          <audio controls>
                            <source src={data.media.url} type="audio/mpeg" />
                            Your browser does not support audio playback.
                          </audio>
                        )}

                        {data.media.type === "file" && (
                          <a 
                            href={data.media.url} 
                            download={data.media.filename}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline flex items-center gap-1"
                          >
                            <IoAttach/> {data?.media?.filename || data?.media?.originalName || "Download File"}
                          </a>
                        )}
                      </section>
                    )}
                    <div className='flex ml-auto py-1 px-2'>
                      {data.text && <p className={`${data.isRemoved ? 'italic text-red-800 dark:text-red-600 opacity-75':''}`}>{data.text} </p> }
                      <span className="text-xs opacity-85 min-w-16 max-h-6 flex justify-center items-center mt-auto place-items-end-safe">{formatChatTimestamp(data.createdAt)}</span> 
                      {data.sender === userId && !data.isRemoved && 
                        <span className='text-sm opacity-85 mt-auto place-items-end-safe'> <MsgIndicator message={data} /> </span> 
                      }
                    </div>
                    
                    {/* <span className="text-xs opacity-85 min-w-16 max-h-6 flex justify-center items-center mt-auto"> {formatChatTimestamp(data.createdAt)} </span> */}
                    {data.sender === userId && (
                      <i onClick={()=>!data.isTemp && setDeleteMsgId(data._id)} 
                        className={`absolute top-1/2 -left-10 transform -translate-y-1/2 hidden 
                          ${data.isTemp ? 'cursor-not-allowed' : 'cursor-pointer'} 
                          ${data.isRemoved ? 'hidden':'group-hover:flex max-md:flex max-md:opacity-10'} h-8 w-8 text-2xl bg-red-500 hover:bg-red-600 text-slate-100 rounded-full justify-center items-center`}> 
                        {isDeleting && deleteMsgId===data._id ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <MdDelete/>
                        )}
                      </i>
                      )
                    }
                    
                    {/* // Add a reply back button
                    // <i><TiArrowBack/></i> */}
                  </div>
                  
                </div>
              )})}
            </div>
          ))}
          <div ref={bottomRef}/>
          {deleteMsgId!==null && (
            <DeleteConfirm msgId={deleteMsgId} open={deleteMsgId!==null} setOpen={()=>setDeleteMsgId(null)}/>
          )}
        </div>

      </div>
    </section>

      {/* Footer - Message Input */}
      <footer className='relative h-20 w-full p-4 max-[425px]:px-2 bg-gray-300 dark:bg-gray-600 border-t border-gray-200 dark:border-gray-700 rounded-b-lg'>
        <div className='flex items-center gap-3 max-[425px]:gap-2'>
          {/* File Upload */}
          <div className='flex items-center gap-2'>
            <input id='addFiles' type='file' className='hidden' onChange={handleFileChange} accept="image/*,.pdf,.doc,.docx,.txt"/>
            <label htmlFor='addFiles' className='p-2 max-[375px]:p-1 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors' title="Attach file" >
              <TbCloudUpload className='text-xl' />
            </label>

            <button onClick={()=>setShowEmojiPicker(!showEmojiPicker)} className='p-2 max-[425px]:p-0 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-lg transition-colors' title="Add emoji">
              <BsEmojiSmile className='text-xl' />
            </button>
            <AnimatePresence >
              {showEmojiPicker && (
                <motion.div
                  ref={pickerRef}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.25 }} 
                  className='absolute bottom-20 left-6'>
                  <EmojiPicker theme={chatTheme==='dark'?'dark':'light'} onEmojiClick={onEmojiClick} />
                </motion.div>
              )}
            </AnimatePresence >
          </div>

          {/* Message Input */}
          <div className='flex-1 relative'>
            <textarea
              value={message}
              onChange={(e) => handleTyping(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className='input-field w-full p-3 pr-12 rounded-lg focus:ring-2 '
              rows="1"
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
            {selectedFile && (selectedFile.type.startsWith("image/") ? (
                <div className="">
                  <img src={URL.createObjectURL(selectedFile)} alt="preview" className="absolute bottom-16 h-36 w-36 object-cover rounded-lg border" />
                  <button onClick={()=>setSelectedFile(null)} className="absolute bottom-46 left-30  bg-black/50 text-white text-sm rounded-full w-5 h-5 flex items-center justify-center hover:bg-black" >
                    <IoMdClose/>
                  </button>
                </div>
              ) : (
                <div className="absolute bottom-12 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs p-2 rounded-lg flex items-center gap-1">
                  <span className="truncate max-w-[150px]">{selectedFile.name}</span>
                  <button onClick={() => setSelectedFile(null)} className="text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100" >
                    <IoMdClose/>
                  </button>
                </div>
              )
            )}
          </div>

          {/* Send Button */}
          <button
            onClick={handleSendMessage}
            disabled={!message.trim() && !selectedFile}
            className='p-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 dark:disabled:bg-gray-700 text-white rounded-lg transition-colors disabled:cursor-not-allowed flex items-center justify-center'
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
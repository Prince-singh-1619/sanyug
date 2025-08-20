import React, { useEffect, useState } from 'react'
import dummyDp from '../assets/person-dummy.svg'
import { SlOptionsVertical } from "react-icons/sl";
import { LuTextSearch } from "react-icons/lu";
import { TbCloudUpload } from "react-icons/tb";
import { FaPersonWalkingArrowRight } from "react-icons/fa6";
import { IoSend } from "react-icons/io5";
import { BsEmojiSmile } from "react-icons/bs";
import { MdAttachFile } from "react-icons/md";
import SummaryApi from '../helpers/SummaryApi';
import { toast } from 'react-toastify';
import TextOutline from '../helpers/TextOutline';
import { HiRefresh } from "react-icons/hi";
import { AiOutlineSelect } from 'react-icons/ai';
import socket from '../helpers/socket'


const Message = ({convoId}) => {
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [messageList, setMessageList] = useState([])
  // const list = messageList
  

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
    if (message.trim() || selectedFile) {
      console.log('Sending message:', message);
      console.log('Selected file:', selectedFile);

      const payload = {
        convoId,
        sender: userId,
        text: message,
        media: selectedFile || null,
        isRead: false,
        createdAt: new Date().toISOString()
      }

      const res = await fetch(SummaryApi.sendMessage.url, {
        method: SummaryApi.sendMessage.method,
        headers:{
          'Content-type' : 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const resData = await res.json();
      if(resData.success){
        toast.success(resData.message)
        // Emit live events to other clients
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
        },
      })

      const resData = await res.json()
      if(resData.success){
        setMessageList(resData.data)
        console.log("resData", resData)
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
    if(convoId ){
    // if(convoId && !messageList){
      handleGetMessages()
    }

    socket.on("receiveMessage", (data)=>{
      if(data.convoId===convoId){
        setMessageList((prev) => [...prev, data])
      }
    })
    return () => socket.off("receiveMessage")
  }, [convoId])
  // }, [])

  console.log("sender:", messageList?.sender)
  console.log("userId:", userId)
  const me = messageList?.sender===userId ? true : false
  console.log("me: ", me)


  return (
    <section className='w-full h-[99vh] max-h-screen flex flex-col  rounded-lg border border-slate-400 shadow-sm'>
      {/* Header */}
      <header className='h-16 w-full px-4 py-3 flex justify-between items-center bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 rounded-t-lg'>
        <div className='flex items-center gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors'>
          <img src={dummyDp} alt='Profile' className='w-10 h-10 object-cover rounded-full border-2 border-gray-200 dark:border-gray-600' />
          <div className='flex flex-col'>
            <p className='font-semibold text-gray-900 dark:text-white text-sm'>Prince Singh</p>
            <span className='text-xs text-green-600 dark:text-green-400 flex items-center gap-1'>
              <div className='w-2 h-2 bg-green-500 rounded-full'></div>
              Online
            </span>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <button onClick={handleGetMessages} className='p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors'>
            <HiRefresh className='text-lg' />
          </button>
          <button className='p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors'>
            <LuTextSearch className='text-lg' />
          </button>
          <button className='p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors'>
            <SlOptionsVertical className='text-lg' />
          </button>
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

        <div className={`w-full h-full flex flex-col `}>
          {messageList.map((data, index)=>{
            return(
              <p key={index} className={`text-lg font-medium mb-2 px-2 ${data.sender===userId?'place-items-end':'place-items-start'} `}>
                <div className={`w-fit max-w-[80%] h-fit border py-1 px-2 rounded-lg  ${data.sender===userId ? 'rounded-br-none':'rounded-bl-none'} bg-green-600 bg-opacity-50`}>{data.text}</div>
              </p>
            )
          })}
        </div>
      </div>

      {/* Footer - Message Input */}
      <footer className='h-20 w-full p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 rounded-b-lg'>
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
              className='p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors'
              title="Attach file"
            >
              <TbCloudUpload className='text-xl' />
            </label>
            <button 
              className='p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors'
              title="Add emoji"
            >
              <BsEmojiSmile className='text-xl' />
            </button>
          </div>

          {/* Message Input */}
          <div className='flex-1 relative'>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
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
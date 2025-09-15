import React from 'react'
import Message from './Message'
import { FaEye } from 'react-icons/fa'
// import pic1 from '../assets/hero image.png'
// import pic2 from '../assets/prince-2.png'
// import pic3 from '../assets/tabish.jpg'
// import pic4 from '../assets/crsl-l1.jpg'
// import pic5 from '../assets/pratham.jpg'
import dummyDp from '../assets/person-dummy.svg'
import { useState } from 'react'
import { useEffect } from 'react'
import SummaryApi from '../helpers/SummaryApi'
import Sidebar from '../components/Sidebar'
import { AiOutlineSelect } from "react-icons/ai";
import ResizableDiv from '../helpers/ResizableDiv'
// import { connectSocket } from '../socket/socket'
import { Outlet, useNavigate, useOutlet } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setActiveChat } from '../redux/slices/chatSlice'
import { setActiveConvo, setConvos } from '../redux/slices/convoSlice'
import MsgIndicator from '../components/MsgIndicator'
import { Socket } from 'socket.io-client'
import { connectSocket } from '../socket/socket'


const Conversations = () => {
    const authToken = localStorage.getItem("authToken");
    const userData = JSON.parse(localStorage.getItem("userData"))
    const userId = userData?.userId

    // const [convoList, setConvoList] = useState([])
    // const [activeChat, setActiveChat] = useState([])
    // const [activeChatIdx, setActiveChatIdx] = useState(-1)
    // const [activeConvoId, setActiveConvoId] = useState(0)
    const { activeConvoId_otherSide } = useSelector(state => state.chat);
    console.log("activeConvoId_otherSide in Conversations:", activeConvoId_otherSide);

    const { activeConvoId, convoList } = useSelector(state => state.convo);
    const [loading, setLoading] = useState(false)
    const loadingArray = new Array(5).fill(null)

    // const {  } = useSelector((state)=>state.convo)
    
    const navigate = useNavigate()
    const outlet = useOutlet()
    const dispatch = useDispatch()

    const socket = connectSocket();

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

    const fetchAllChats = async() =>{
        console.log("fetching chats")
        // console.log("userId in fetch-all-chats", userId)

        try {
            setLoading(true)
            const res = await fetch(`${SummaryApi.fetchConvos.url}?userId=${userId}`, {
                method: SummaryApi.fetchConvos.method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
            });
            if (!res.ok) {
                throw new Error('Failed to fetch chats');
            }
            const resData = await res.json();
            // console.log("resData in fetchAllChats:", resData);

            const allConvo = resData.data.map(convo => {
                if (convo.isGroup) {
                    // Group chat display
                    return {
                        convoId: convo._id,
                        name: convo.groupName,
                        profilePic: convo?.groupImage,
                        lastMsg: convo.lastMessage,
                        sender: convo.lastMessage?.sender,
                        participants: convo.participants,
                        createdAt: convo?.lastMessage?.createdAt ? formatChatTimestamp(convo?.lastMessage.createdAt) : formatChatTimestamp(convo.createdAt),
                        unreadCount: convo.unreadCount
                    };
                } else {
                    // One-to-one chat
                    const otherUser = convo.participants.find(p => p._id !== userId); // assuming you already filtered out logged-in user
                    return {
                        convoId: convo._id,
                        name: `${otherUser.firstName} ${otherUser.lastName}`,
                        profilePic: otherUser?.profilePic ,
                        lastMsg: convo?.lastMessage,
                        // lastMsgId: convo.lastMessage.msgId,
                        // lastMessage: convo.lastMessage?.text || '',
                        sender: convo?.lastMessage?.sender,
                        participants: convo.participants,
                        lastSeen:  formatChatTimestamp(otherUser.lastSeen),
                        // createdAt: formatChatTimestamp(convo?.lastMessage?.createdAt)
                        createdAt: convo?.lastMessage?.createdAt ? formatChatTimestamp(convo?.lastMessage.createdAt) : formatChatTimestamp(convo.createdAt),
                        unreadCount: convo.unreadCount
                    };
                }
            });

            // setConvoList(allConvo); // update state
            dispatch(setConvos({allConvo, userId}));
            console.log("convo list: ", allConvo)
        } catch (error) {
            console.error("Error fetching convos", error)
        } finally{
            setLoading(false)
        }
    }
    // if(convoList) console.log("After resData: ", convoList)

    useEffect(()=>{
       fetchAllChats()
    //    if(!convoList) fetchAllChats()
    }, [])

    const displayMessage = (index) =>{
        // setActiveChatIdx(index)
        // console.log("convoList displayMessage: ", convoList)
        const selectedChat = convoList[index];
        if(!selectedChat) return 

        const convoId = selectedChat.convoId
        // setActiveChat(selectedChat)
        // setActiveConvoId(convoId)
        // dispatch(setActiveChat({ chat: selectedChat, convoId: selectedChat.convoId }))
        dispatch(setActiveChat({ chat:selectedChat }))
        dispatch(setActiveConvo({ newConvoId:convoId, participants:selectedChat.participants.map(p=>p._id) }))

        navigate(`/conversations/${convoId}`, 
            {state: {activeChat:selectedChat}}
        )
        console.log("convoId", convoId)
    }
    useEffect(()=>{
        console.log("activeConvoId", activeConvoId)
    }, [activeConvoId])


  return (
    <section className='w-100vw max-h-screen overflow-hidden flex gap-1'>
      <section>
        <Sidebar/>
      </section>

      <ResizableDiv className='h-[99vh] w-1/4 min-w-1/5 max-w-1/2 overflow-y-scroll scrollbar-hide border border-slate-400 rounded-lg'>
        <div className='w-full border-b border-slate-400 py-4'>
            <div className='w-9/10 h-10 rounded-full border border-slate-500 m-auto'>search bar</div>
        </div>
        <div className=' flex flex-col justify-center'>
            {loading ? (
                loadingArray.map((el,index)=>{ return(
                    <div key={el+index} className={`w-full h-18  my-auto border-b border-slate-400 odd:bg-slate-300 dark:odd:bg-slate-800`}>
                        <div className='h-full flex items-center justify-between px-2 animate-pulse'>
                            <div className='flex items-center gap-2 justify-center animate-pulse'>
                                <div className='w-12 h-12 rounded-lg bg-gray-500 animate-pulse'/>
                                <div className='flex flex-col gap-2'>
                                    <p className='text-lg font-lg h-4 w-28 bg-gray-500 animate-pulse'></p>
                                    <span className='opacity-90 h-2 w-16 bg-gray-500 animate-bounce '></span>
                                </div>
                            </div>
                            <div className='opacity-90 font-sm text-xs w-12 h-4 bg-gray-500 animate-bounce'></div>
                        </div>
                    </div>    
                )})
            ) : (
                convoList.map((data, index)=>{
                    return(
                        <button key={index} onClick={()=>displayMessage(index)} className={`h-18 my-auto cursor-pointer border-b border-slate-400 hover:bg-gray-300 dark:hover:bg-gray-500/75 ${activeConvoId===data.convoId ? 'bg-gray-400/75 dark:bg-gray-600 text-black dark:text-white':''}`}>
                            <div className='w-full flex items-center justify-between px-2 '>
                                <div className='w-full flex items-center gap-2 justify-center'>
                                    <img src={data.profilePic ? data.profilePic : dummyDp} alt={data.name} className='w-12 h-12 rounded-lg object-cover'/>
                                    <div className='w-full flex flex-col items-start'>
                                        <div className='w-full flex items-center justify-between'>
                                            <p className='text-lg font-lg capitalize'>{data.name}</p>
                                            {/* <span className='opacity-90 font-sm text-xs'>{data.createdAt}</span> */}
                                            <span className='opacity-90 font-sm text-xs'>{data.lastSeen}</span>
                                        </div>
                                        <div className='w-full flex items-center justify-between'>
                                            <div className='opacity-75 text-sm flex gap-2 items-center'>
                                                { (data?.lastMsg?.sender===userId && data.lastMsg) && <i className='mt-[1px]'><MsgIndicator message={data.lastMsg}/></i> }
                                                <span>{data?.lastMsg?.text}</span>
                                            </div>
                                            {data.unreadCount ? <span className='w-4 h-4 rounded-full bg-green-500 text-xs text-white dark:text-black flex justify-center items-center'>{data.unreadCount}</span> : '' }
                                        </div> 
                                    </div>
                                </div>
                                {/* <div className='opacity-90 font-sm text-xs'>{data.createdAt}</div> */}
                            </div>
                        </button>        
                    )
                })
            )}
        </div>
      </ResizableDiv>

      {/* message area */}
      <section className='w-full flex-1'>
        {activeConvoId ? (
            <Outlet/>
        )  :(
            <div className='flex flex-col items-center justify-center h-full text-center rounded-lg border border-slate-400 shadow-sm'>
                <div className='w-16 h-16 bg-gray-400 dark:bg-gray-700 rounded-xl flex items-center justify-center mb-4'>
                    <AiOutlineSelect className='text-2xl ' />
                </div>
                <p className='text-3xl font-medium mb-2'>
                    Select a conversation
                </p>
                <p className='text-sm opacity-75 max-w-sm'>
                    Choose a conversation from the sidebar to start messaging
                </p>
            </div>
        )}
      </section>
    </section>
  )
}

export default Conversations
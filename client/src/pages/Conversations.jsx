import React from 'react'
import dummyDp from '../assets/person-dummy.svg'
import { useState } from 'react'
import { useEffect } from 'react'
import SummaryApi from '../helpers/SummaryApi'
import Sidebar from '../components/Sidebar'
import { AiOutlineSelect } from "react-icons/ai";
import { Outlet, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setActiveChat } from '../redux/slices/chatSlice'
import { resetUnreadCount, setActiveConvo, setConvos } from '../redux/slices/convoSlice'
import MsgIndicator from '../components/MsgIndicator'
import { BiUser } from 'react-icons/bi'
import { MdPersonAdd, MdPersonAddAlt1 } from 'react-icons/md'
import useResizable from '../hooks/useResizable'
import { decryptMessage } from '../helpers/cryption'
import { SlOptionsVertical } from 'react-icons/sl'
import { HiOutlineDocumentSearch } from 'react-icons/hi'
import ConvoDropdown from '../components/ConvoDropdown'
import UserSearchPopup from '../popups/UserSearchPopup'
import useIsMobile from '../hooks/useIsMobile'


const Conversations = () => {
    // const authToken = localStorage.getItem("authToken");
    // const userData = JSON.parse(localStorage.getItem("userData"))
    const { authToken, userData } = useSelector(state => state.user)
    const userId = userData?._id

    // console.log("authToken", typeof authToken, "userData", typeof userData)

    const { width, handleMouseDown } = useResizable(25, 20, 45);
    // const [unformattedList, setUnformattedList] = useState([])
    // const [activeChat, setActiveChat] = useState([])
    // const [activeChatIdx, setActiveChatIdx] = useState(-1)
    // const [activeConvoId, setActiveConvoId] = useState(0)
    // const { activeConvoId_otherSide } = useSelector(state => state.chat);
    // console.log("activeConvoId_otherSide in Conversations:", activeConvoId_otherSide);

    const { activeConvoId, convoList } = useSelector(state => state.convo);
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const loadingArray = new Array(5).fill(null)
    const [isAdding, setIsAdding] = useState(false)
    const [convoDropdown, setConvoDropdown] = useState(false)
    const [isAddPopupOpen, setIsAddPopupOpen] = useState(false)
    const [search, setSearch] = useState("");

    // const {  } = useSelector((state)=>state.convo)
    
    const navigate = useNavigate()
    // const outlet = useOutlet()
    const dispatch = useDispatch()

    // const socket = connectSocket();

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

    const decryptAllConversations = async (conversations) => {
        return Promise.all(
            conversations.map(async (convo) => {
                let decryptedLastMessage = null;

                if (convo.lastMessage) {
                    try {
                        const plainText = await decryptMessage(convo.lastMessage.text, convo._id);
                        decryptedLastMessage = {
                            ...convo.lastMessage,
                            text: plainText, // decrypted text
                    };
                    } catch (err) {
                        console.error("Failed to decrypt lastMessage:", err);
                        decryptedLastMessage = convo.lastMessage; // fallback (still encrypted)
                    }
                }

                return {
                    ...convo,
                    lastMessage: decryptedLastMessage,
                };
            })
        );
    };


    const fetchAllChats = async() =>{
        console.log("fetching chats")
        setError(false)
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
            const decryptedConvos = await decryptAllConversations(resData.data);

            const allConvo = decryptedConvos.map(convo => {
                if (convo.isGroup) {
                    // Group chat display
                    return {
                        convoId: convo._id,
                        name: convo.groupName,
                        profilePic: convo?.groupImage,
                        lastMsg: convo?.lastMessage,
                        // hasMedia: convo?.media?.filename ? true:false,
                        // lastMsg: convo?.lastMessage===''||!convo.lastMessage ? 'Files attached' : convo.lastMessage,
                        // lastMsg: decryptMessage(convo.lastMessage, convo._id),
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
                        // hasMedia: convo?.media?.filename ? true:false,
                        // lastMsg: !convo?.lastMessage.text ? "File attached" : convo.lastMessage,
                        // lastMsgId: convo.lastMessage.msgId,
                        // lastMessage: convo.lastMessage?.text || '',
                        sender: convo?.lastMessage?.sender,
                        participants: convo.participants,
                        lastSeen:  formatChatTimestamp(otherUser.lastSeen),
                        // createdAt: formatChatTimestamp(convo?.lastMessage?.createdAt)
                        createdAt: convo?.lastMessage?.createdAt ? formatChatTimestamp(convo?.lastMessage.createdAt) : formatChatTimestamp(convo.createdAt),
                        unreadCount: convo?.unreadCount || 0
                    };
                }
            });

            // setConvoList(allConvo); // update state
            dispatch(setConvos({allConvo, userId}));
            // console.log("convo list: ", allConvo)
        } catch (error) {
            setError(true)
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
        dispatch(resetUnreadCount({convoId}))

        navigate(`/conversations/${convoId}`, 
            {state: {activeChat:selectedChat}}
        )
        console.log("convoId", convoId)
    }

    // useEffect(()=>{
    //     console.log("activeConvoId", activeConvoId)
    // }, [activeConvoId])

    // for a new user
    const handleAddToChat = async() => {
        try {
            setIsAdding(true)
            console.log("Adding user to chat")

            const res = await fetch(SummaryApi.addUserToChat.url, {
                method: SummaryApi.addUserToChat.method,
                headers:{
                    'Content-type' : 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify({
                    participants: [userId, '689823b7d6f9e7d01ea8f958']
                })
            })

            const data = await res.json();

            if (!res.ok) {
                console.error('Error creating/fetching conversation:', data.message);
                return;
            }

            console.log('Conversation created/fetched:', data);
            window.location.reload()  // reloads the page

            // Optionally update your state to show new conversation instantly
            // setConversations(prev => [...prev, data]);
        } catch (error) {
            console.error("Error adding to chat: ", error)
        } finally{
            setIsAdding(false)
        }
    }

    const handleOpenPopup = () => { setIsAddPopupOpen(true) }
    const handleClosePopup = () => { setIsAddPopupOpen(false) }

    // const { convoId } = useParams();
    const isMobile = useIsMobile();

    if (isMobile && activeConvoId) {
        // Mobile: only show list or message
        // if (convoId) {
            return (
                // <div className="h-full w-full">
                <Outlet /> 
                // </div>
            );
        // }
    }

    // filter convos to filterConvo and render
    const filteredConvos = convoList.filter(convo=> 
        convo.name.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <section className='w-100vw max-h-screen overflow-hidden flex '>
      <section className='max-[425px]:hidden'>
        <Sidebar/>
      </section>

      <section style={{ width: `${width}%`}} className="h-[99vh] min-w-56 ml-2 mr-1 border border-slate-400 rounded-lg transition-all md:max-w-1/2 overflow-hidden">
        <div className='w-full mx-auto border-b border-slate-400 py-4 px-2 flex gap-2 justify-center' >
            <div className="w-[95%] h-10 rounded-lg border border-slate-500 flex items-center px-3 gap-2 bg-slate-300/50 dark:bg-[#1a1a1a]">
                <HiOutlineDocumentSearch className="min-w-6 text-xl text-gray-800 dark:text-gray-300" />
                <input type="text" placeholder="Search here" value={search} onChange={(e)=>setSearch(e.target.value)} className="w-full flex-1 bg-transparent outline-none text-sm  placeholder-gray-800 dark:placeholder-gray-400 " />
            </div>
            {/* <span className='text-2xl tracking-widest font-bold'>Sanyug</span> */}
            <button onClick={()=>setConvoDropdown((prev)=>!prev)} className='max-[425px]:block hidden px-2 bg-transparent rounded-lg transition-colors'>
                <SlOptionsVertical className='text-lg' />
            </button>
            <div className='absolute z-50 right-4 top-19'>{convoDropdown && <ConvoDropdown/>}</div>
            
        </div>

        <div className='flex flex-col justify-center overflow-y-scroll scrollbar-hide'>
            {loading ? (
                loadingArray.map((el,index)=>{ return(
                    <div key={el+index} className={`w-full h-18  my-auto border-b border-slate-400 odd:bg-slate-300 dark:odd:bg-slate-800`}>
                        <div className='h-full flex items-center justify-between px-2 animate-pulse'>
                            <div className='flex items-center gap-2 justify-center animate-pulse'>
                                <div className='w-12 h-12 rounded-lg bg-gray-500 animate-pulse'/>
                                <div className='flex flex-col gap-2'>
                                    <p className='text-lg font-lg h-3 w-24 bg-gray-500 animate-pulse'></p>
                                    <span className='opacity-90 h-2 w-16 bg-gray-500 animate-bounce '></span>
                                </div>
                            </div>
                            <div className='opacity-90 font-sm text-xs w-10 h-3 bg-gray-500 animate-bounce'></div>
                        </div>
                    </div>    
                )})
            ) : (
                // convoList.map((data, index)=>{
                filteredConvos.length > 0 ? 
                filteredConvos.map((data, index)=>{
                    return(
                        <button key={index} onClick={()=>displayMessage(index)} className={`h-18 my-auto cursor-pointer border-b border-slate-400 hover:bg-gray-300 dark:hover:bg-gray-500/75 ${activeConvoId===data.convoId ? 'bg-gray-400/75 dark:bg-gray-600 text-black dark:text-white':''}`}>
                            <div className='w-full flex items-center justify-between px-2 '>
                                <div className='w-full flex items-center gap-2 justify-center'>
                                    <img src={data.profilePic ? data.profilePic?.lowResPic : dummyDp} alt={data?.name} className='min-w-12 h-12 rounded-lg object-cover'/>
                                    <div className='w-full flex flex-col items-start'>
                                        <div className='w-full flex items-center justify-between'>
                                            <p className='text-lg font-lg capitalize text-nowrap overflow-hidden'>{data?.name}</p>
                                            <span className='opacity-90 font-sm text-xs'>{data?.lastSeen}</span>
                                        </div>
                                        <div className='w-full flex items-center justify-between'>
                                            <div className='opacity-75 text-sm flex gap-2 items-center'>
                                                { (data?.lastMsg?.sender===userId && data.lastMsg) && <i className='mt-[1px]'><MsgIndicator message={data.lastMsg}/></i> }
                                                <span className={`${data?.lastMsg?.media ? 'italic' : ''}`}>{data?.lastMsg?.media ? "File attached" : data?.lastMsg?.text}</span>
                                            </div>
                                            {data.unreadCount ? <span className='w-4 h-4 rounded-full bg-green-500 text-xs text-white dark:text-black flex justify-center items-center'>{data.unreadCount}</span> : '' }
                                        </div> 
                                    </div>
                                </div>
                            </div>
                        </button>        
                    )
                }) : (
                    <p className="">No conversations found</p>
                )
            )}

            {/* for new user */}
            { error ? "Error loading Chats" : (
                !loading && convoList.length===0 && 
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600 flex flex-col gap-4">
                    <span className='text-yellow-400 mx-auto'>Don't have anyone yet, try chatting with the Admin</span>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                            <BiUser className="w-6 h-6 " />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white"> Prince Singh </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400"> @princesinghps1619 </p>
                        </div>
                        <button
                            onClick={handleAddToChat}
                            className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full transition-colors duration-200 cursor-pointer"
                            title="Add to chat"
                        >
                            { isAdding ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                            <MdPersonAdd className="w-5 h-5" />
                            ) }
                        </button>
                    </div>
                </div>
            )}
        </div>
      </section>

      {/* width handle */}
      <section onMouseDown={handleMouseDown} className='max-md:hidden h-[99vh] -ml-[2px] mr-[2px] cursor-ew-resize hover:bg-blue-500 flex items-center'>
        <div className="h-10 my-auto rounded-lg flex flex-col justify-around items-center">
            <span className="w-1 h-1 rounded-lg bg-black/75 dark:bg-white/75"></span>
            <span className="w-1 h-1 rounded-lg bg-black/75 dark:bg-white/75"></span>
            <span className="w-1 h-1 rounded-lg bg-black/75 dark:bg-white/75"></span>
        </div>
      </section>

      {/* message area */}
      <section className='w-full max-md:hidden flex-1'>
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


        {/* user search on phone screen */}
        <div onClick={handleOpenPopup} title='Add to Chat' className="absolute  bottom-12 right-12 hidden max-[425px]:flex flex-col justify-center items-center w-15 h-15 rounded-lg text-2xl bg-green-400 dark:text-black hover:bg-green-500 transition-colors duration-200 cursor-pointer" >
            <i className='text-3xl'> <MdPersonAddAlt1 /> </i>
        </div>
        {isAddPopupOpen && <UserSearchPopup isOpen={isAddPopupOpen} onClose={handleClosePopup} />}
    </section>
  )
}

export default Conversations
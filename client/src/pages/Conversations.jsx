import React from 'react'
import Message from './Message'
import { FaEye } from 'react-icons/fa'
// import pic1 from '../assets/hero image.png'
// import pic2 from '../assets/prince-2.png'
// import pic3 from '../assets/tabish.jpg'
// import pic4 from '../assets/crsl-l1.jpg'
// import pic5 from '../assets/pratham.jpg'
import dummyDp from '../assets/person-dummy.svg'
import { MdPersonAddAlt1 } from 'react-icons/md'
import { IoMdMenu } from "react-icons/io";
import { useState } from 'react'
import { useEffect } from 'react'
import SummaryApi from '../helpers/SummaryApi'
import Sidebar from '../components/Sidebar'
import { AiOutlineSelect } from "react-icons/ai";



const Conversations = () => {
    const userData = JSON.parse(localStorage.getItem("userData"))
    const userId = userData?.userId

    const [convoList, setConvoList] = useState([])
console.log("first")
    const [activeChatIdx, setActiveChatIdx] = useState(-1)
    // const [activeChatIdx, setActiveChatIdx] = useState(0)
    const [activeConvoId, setActiveConvoId] = useState(0)
    
    // const convoList = [
    //     {
    //         profilePic: pic1,
    //         name: 'Prince singh',
    //         lastMessage: "Bye",
    //         createdAt: "10:24 am"
    //     },
    //     {
    //         profilePic: pic2,
    //         name: 'Abhinav kushwaha',
    //         lastMessage: "chalo",
    //         createdAt: "08:04 pm"
    //     },
    //     {
    //         profilePic: pic3,
    //         name: 'Vishnu pandey',
    //         lastMessage: "Kya maharaj",
    //         createdAt: "11:30 am"
    //     },
    //     {
    //         profilePic: pic4,
    //         name: 'Akhil kumar',
    //         lastMessage: "Banega",
    //         createdAt: "06:40 pm"
    //     },
    //     {
    //         profilePic: pic5,
    //         name: 'Akhilesh gupta',
    //         lastMessage: "sab khatam",
    //         createdAt: "11:30 pm"
    //     },
    //     {
    //         profilePic: pic1,
    //         name: 'Prince singh',
    //         lastMessage: "Bye",
    //         createdAt: "10:24 am"
    //     },
    //     {
    //         profilePic: pic2,
    //         name: 'Abhinav kushwaha',
    //         lastMessage: "chalo",
    //         createdAt: "08:04 pm"
    //     },
    //     {
    //         profilePic: pic3,
    //         name: 'Vishnu pandey',
    //         lastMessage: "Kya maharaj",
    //         createdAt: "11:30 am"
    //     },
    //     {
    //         profilePic: pic4,
    //         name: 'Akhil kumar',
    //         lastMessage: "Banega",
    //         createdAt: "06:40 pm"
    //     },
    //     {
    //         profilePic: pic5,
    //         name: 'Akhilesh gupta',
    //         lastMessage: "sab khatam",
    //         createdAt: "11:30 pm"
    //     },
    //     {
    //         profilePic: pic1,
    //         name: 'Prince singh',
    //         lastMessage: "Bye",
    //         createdAt: "10:24 am"
    //     },
    //     {
    //         profilePic: pic2,
    //         name: 'Abhinav kushwaha',
    //         lastMessage: "chalo",
    //         createdAt: "08:04 pm"
    //     },
    //     {
    //         profilePic: pic3,
    //         name: 'Vishnu pandey',
    //         lastMessage: "Kya maharaj",
    //         createdAt: "11:30 am"
    //     },
    //     {
    //         profilePic: pic4,
    //         name: 'Akhil kumar',
    //         lastMessage: "Banega",
    //         createdAt: "06:40 pm"
    //     },
    //     {
    //         profilePic: pic5,
    //         name: 'Akhilesh gupta',
    //         lastMessage: "sab khatam",
    //         createdAt: "11:30 pm"
    //     },
    // ]

    console.log("first")

    const formatChatTimestamp = (dateString) =>{
        const date = new Date(dateString);
        const now = new Date();

        // Helper to zero out time for date comparison
        const stripTime = d => new Date(d.getFullYear(), d.getMonth(), d.getDate());

        const today = stripTime(now);
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const messageDate = stripTime(date);

        if (messageDate.getTime() === today.getTime()) {
            // Today → show time
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (messageDate.getTime() === yesterday.getTime()) {
            // Yesterday
            return 'Yesterday';
        } else {
            // Older → show date
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }
    }

    const fetchAllChats = async() =>{
        console.log("fetching chats")
        try {
            const res = await fetch(`${SummaryApi.fetchConvos.url}?userId=${userId}`, {
                method: SummaryApi.fetchConvos.method,
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) {
                throw new Error('Failed to fetch chats');
            }

            const resData = await res.json();

            const allConvo = resData.data.map(convo => {
                if (convo.isGroup) {
                    // Group chat display
                    return {
                        convoId: convo._id,
                        name: convo.groupName,
                        profilePic: convo.groupImage || '/default-group.png',
                        lastMessage: convo.lastMessage?.text || '',
                        createdAt: formatChatTimestamp(convo.lastMessage?.createdAt)
                    };
                } else {
                    // One-to-one chat
                    const otherUser = convo.participants.find(p => p._id !== userId); // assuming you already filtered out logged-in user
                    return {
                        convoId: convo._id,
                        name: `${otherUser.firstName} ${otherUser.lastName}`,
                        profilePic: otherUser.profilePic || '/default-user.png',
                        lastMessage: convo.lastMessage?.text || '',
                        createdAt: formatChatTimestamp(convo.lastMessage?.createdAt)
                    };
                }
            });

            setConvoList(allConvo); // update state
            console.log("convo list: ", resData)
        } catch (error) {
            console.error("Error fetching convos", error)
        }
    }

    useEffect(()=>{
       fetchAllChats()
    //    if(!convoList) fetchAllChats()
    }, [])

    const displayMessage = (index) =>{
        // setActiveChatIdx(index)
        // console.log("chat index", activeChatIdx)
        const convoId = convoList[index].convoId
        setActiveConvoId(convoId)
        console.log("convoId", convoId)
        console.log("activeConvoId", activeConvoId)
    }

    
  return (
    <section className='w-100vw max-h-screen overflow-hidden flex gap-1'>
      <section>
        <Sidebar/>
      </section>
      <section className='h-[99vh] w-1/4 overflow-y-scroll border rounded-lg'>
        <div className='w-9/10 h-10 rounded-full border border-slate-500 m-auto mt-4'>
            search bar
        </div>
        <div className=' flex flex-col justify-center py-2'>
            {!convoList.length && 
                <div>
                    {/* // show loading skeleton */}
                    loading...
                </div>
            }
            {convoList.map((data, index)=>{
                return(
                    <div key={index} onClick={()=>displayMessage(index)} className={`h-18  my-auto cursor-pointer hover:bg-gray-500 ${activeConvoId===data.convoId ? 'bg-red-400 text-slate-100 dark:bg-green-600':''}`}>
                        <div className='h-[1px] w-full bg-slate-400'></div>
                        <div className='flex items-center justify-between px-4 my-2'>
                            <div className='flex items-center gap-2 justify-center'>
                                <img src={data.profilePic.length ? data.profilePic : dummyDp} alt={data.name} className='w-12 h-12 rounded-full bg-red-200 object-cover'/>
                                {/* <i><FaEye/></i> */}
                                <div className=''>
                                    <p className='text-lg font-lg'>{data.name}</p>
                                    <span className='opacity-90'>{data.lastMessage}</span>
                                </div>
                            </div>
                            <div className='opacity-90 font-sm text-xs'>{data.createdAt}</div>
                        </div>
                    </div>        
                )
            })}

            
            
        </div>
      </section>

      <section className='w-3/4'>
            {/* message area */}
            {activeConvoId ? 
                <Message convoId={activeConvoId}/> : 
                <div className='flex flex-col items-center justify-center h-full text-center'>
                    <div className='w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4'>
                        <AiOutlineSelect className='text-2xl text-gray-500 dark:text-gray-400' />
                    </div>
                    <p className='text-3xl font-medium mb-2'>
                        Select a conversation
                    </p>
                    <p className='text-sm opacity-75 max-w-sm'>
                        Choose a conversation from the sidebar to start messaging
                    </p>
                </div>
            }
      </section>
    </section>
  )
}

export default Conversations
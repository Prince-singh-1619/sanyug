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
import ResizableDiv from '../helpers/ResizableDiv'
import socket from '../helpers/socket'
import { Outlet, useNavigate, useOutlet } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setActiveChat } from '../redux/slices/chatSlice'
import { MdOutlineAccessTime } from "react-icons/md";
import MsgIndicator from '../components/MsgIndicator'


const Conversations = () => {
    const authToken = localStorage.getItem("authToken");
    const userData = JSON.parse(localStorage.getItem("userData"))
    const userId = userData?.userId

    const [convoList, setConvoList] = useState([])
    // const [activeChat, setActiveChat] = useState([])
    // const [activeChatIdx, setActiveChatIdx] = useState(-1)
    // const [activeConvoId, setActiveConvoId] = useState(0)
    const { activeConvoId } = useSelector(state => state.chat);
    const [loading, setLoading] = useState(false)
    const loadingArray = new Array(5).fill(null)
    // const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const outlet = useOutlet()
    const dispatch = useDispatch()
    
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
    const dummyArr =
    [
        {
        "lastMessage": {
            "createdAt": "2025-08-11T05:38:55.937Z"
        },
        "_id": "689981ef303e6416b74089d1",
        "isGroup": false,
        "participants": [
            {
            "_id": "6899772bd60fae3d4170b10c",
            "firstName": "second",
            "lastName": "singh",
            "profilePic": "ntyyn"
            },
            {
            "_id": "689823b7d6f9e7d01ea8f958",
            "firstName": "Prince",
            "lastName": "singh",
            "profilePic": "fgbdr"
            }
        ],
        "groupName": null,
        "groupImage": null,
        "groupAdmin": [],
        "createdAt": "2025-08-11T05:38:55.944Z",
        "updatedAt": "2025-08-11T05:38:55.944Z",
        "__v": 0
        },
        {
        "lastMessage": {
            "createdAt": "2025-08-15T10:22:41.512Z"
        },
        "_id": "789982af403e7426b74011e2",
        "isGroup": true,
        "participants": [
            {
            "_id": "689823b7d6f9e7d01ea8f958",
            "firstName": "Prince",
            "lastName": "singh",
            "profilePic": "https://cdn.pixabay.com/photo/2024/05/26/10/15/bird-8788491_1280.jpg"
            },
            {
            "_id": "6899992cd70fae3d4170b14d",
            "firstName": "Rahul",
            "lastName": "Mehta",
            "profilePic": 'https://cdn.pixabay.com/photo/2024/05/26/10/15/bird-8788491_1280.jpg'
            },
            {
            "_id": "6899992cd70fae3d4170b14e",
            "firstName": "Ananya",
            "lastName": "Sharma",
            "profilePic": "ananyapic"
            }
        ],
        "groupName": "Project Team",
        "groupImage": "groupimg123",
        "groupAdmin": ["689823b7d6f9e7d01ea8f958"],
        "createdAt": "2025-08-15T10:22:41.520Z",
        "updatedAt": "2025-08-17T08:30:12.210Z",
        "__v": 0
        },
        {
        "lastMessage": {
            "createdAt": "2025-08-16T15:45:21.301Z"
        },
        "_id": "889983bf503e8436b74022f3",
        "isGroup": false,
        "participants": [
            {
            "_id": "6899772bd60fae3d4170b10c",
            "firstName": "second",
            "lastName": "singh",
            "profilePic": "ntyyn"
            },
            {
            "_id": "6899992cd70fae3d4170b14d",
            "firstName": "Rahul",
            "lastName": "Mehta",
            "profilePic": "rahulpic"
            }
        ],
        "groupName": null,
        "groupImage": null,
        "groupAdmin": [],
        "createdAt": "2025-08-16T15:45:21.308Z",
        "updatedAt": "2025-08-16T15:45:21.308Z",
        "__v": 0
        },
        {
        "lastMessage": {
            "createdAt": "2025-08-17T20:11:10.643Z"
        },
        "_id": "989984cf603e9436b75033a4",
        "isGroup": true,
        "participants": [
            {
            "_id": "689823b7d6f9e7d01ea8f958",
            "firstName": "Prince",
            "lastName": "singh",
            "profilePic": "fgbdr"
            },
            {
            "_id": "6899772bd60fae3d4170b10c",
            "firstName": "second",
            "lastName": "singh",
            "profilePic": "ntyyn"
            },
            {
            "_id": "6899992cd70fae3d4170b14e",
            "firstName": "Ananya",
            "lastName": "Sharma",
            "profilePic": "ananyapic"
            }
        ],
        "groupName": "Weekend Plans",
        "groupImage": "weekendgroup",
        "groupAdmin": ["6899992cd70fae3d4170b14e"],
        "createdAt": "2025-08-17T20:11:10.650Z",
        "updatedAt": "2025-08-18T07:55:44.002Z",
        "__v": 0
        },
        {
        "lastMessage": {
            "createdAt": "2025-08-11T05:38:55.937Z"
        },
        "_id": "689981ef303e6416b74089d1",
        "isGroup": false,
        "participants": [
            {
            "_id": "6899772bd60fae3d4170b10c",
            "firstName": "second",
            "lastName": "singh",
            "profilePic": "ntyyn"
            },
            {
            "_id": "689823b7d6f9e7d01ea8f958",
            "firstName": "Prince",
            "lastName": "singh",
            "profilePic": "fgbdr"
            }
        ],
        "groupName": null,
        "groupImage": null,
        "groupAdmin": [],
        "createdAt": "2025-08-11T05:38:55.944Z",
        "updatedAt": "2025-08-11T05:38:55.944Z",
        "__v": 0
        },
        {
        "lastMessage": {
            "createdAt": "2025-08-15T10:22:41.512Z"
        },
        "_id": "789982af403e7426b74011e2",
        "isGroup": true,
        "participants": [
            {
            "_id": "689823b7d6f9e7d01ea8f958",
            "firstName": "Prince",
            "lastName": "singh",
            "profilePic": "https://cdn.pixabay.com/photo/2024/05/26/10/15/bird-8788491_1280.jpg"
            },
            {
            "_id": "6899992cd70fae3d4170b14d",
            "firstName": "Rahul",
            "lastName": "Mehta",
            "profilePic": 'https://cdn.pixabay.com/photo/2024/05/26/10/15/bird-8788491_1280.jpg'
            },
            {
            "_id": "6899992cd70fae3d4170b14e",
            "firstName": "Ananya",
            "lastName": "Sharma",
            "profilePic": "ananyapic"
            }
        ],
        "groupName": "Project Team",
        "groupImage": "groupimg123",
        "groupAdmin": ["689823b7d6f9e7d01ea8f958"],
        "createdAt": "2025-08-15T10:22:41.520Z",
        "updatedAt": "2025-08-17T08:30:12.210Z",
        "__v": 0
        },
        {
        "lastMessage": {
            "createdAt": "2025-08-16T15:45:21.301Z"
        },
        "_id": "889983bf503e8436b74022f3",
        "isGroup": false,
        "participants": [
            {
            "_id": "6899772bd60fae3d4170b10c",
            "firstName": "second",
            "lastName": "singh",
            "profilePic": "ntyyn"
            },
            {
            "_id": "6899992cd70fae3d4170b14d",
            "firstName": "Rahul",
            "lastName": "Mehta",
            "profilePic": "rahulpic"
            }
        ],
        "groupName": null,
        "groupImage": null,
        "groupAdmin": [],
        "createdAt": "2025-08-16T15:45:21.308Z",
        "updatedAt": "2025-08-16T15:45:21.308Z",
        "__v": 0
        },
        {
        "lastMessage": {
            "createdAt": "2025-08-17T20:11:10.643Z"
        },
        "_id": "989984cf603e9436b75033a4",
        "isGroup": true,
        "participants": [
            {
            "_id": "689823b7d6f9e7d01ea8f958",
            "firstName": "Prince",
            "lastName": "singh",
            "profilePic": "fgbdr"
            },
            {
            "_id": "6899772bd60fae3d4170b10c",
            "firstName": "second",
            "lastName": "singh",
            "profilePic": "ntyyn"
            },
            {
            "_id": "6899992cd70fae3d4170b14e",
            "firstName": "Ananya",
            "lastName": "Sharma",
            "profilePic": "ananyapic"
            }
        ],
        "groupName": "Weekend Plans",
        "groupImage": "weekendgroup",
        "groupAdmin": ["6899992cd70fae3d4170b14e"],
        "createdAt": "2025-08-17T20:11:10.650Z",
        "updatedAt": "2025-08-18T07:55:44.002Z",
        "__v": 0
        },
        {
        "lastMessage": {
            "createdAt": "2025-08-11T05:38:55.937Z"
        },
        "_id": "689981ef303e6416b74089d1",
        "isGroup": false,
        "participants": [
            {
            "_id": "6899772bd60fae3d4170b10c",
            "firstName": "second",
            "lastName": "singh",
            "profilePic": "ntyyn"
            },
            {
            "_id": "689823b7d6f9e7d01ea8f958",
            "firstName": "Prince",
            "lastName": "singh",
            "profilePic": "fgbdr"
            }
        ],
        "groupName": null,
        "groupImage": null,
        "groupAdmin": [],
        "createdAt": "2025-08-11T05:38:55.944Z",
        "updatedAt": "2025-08-11T05:38:55.944Z",
        "__v": 0
        },
        {
        "lastMessage": {
            "createdAt": "2025-08-15T10:22:41.512Z"
        },
        "_id": "789982af403e7426b74011e2",
        "isGroup": true,
        "participants": [
            {
            "_id": "689823b7d6f9e7d01ea8f958",
            "firstName": "Prince",
            "lastName": "singh",
            "profilePic": "https://cdn.pixabay.com/photo/2024/05/26/10/15/bird-8788491_1280.jpg"
            },
            {
            "_id": "6899992cd70fae3d4170b14d",
            "firstName": "Rahul",
            "lastName": "Mehta",
            "profilePic": 'https://cdn.pixabay.com/photo/2024/05/26/10/15/bird-8788491_1280.jpg'
            },
            {
            "_id": "6899992cd70fae3d4170b14e",
            "firstName": "Ananya",
            "lastName": "Sharma",
            "profilePic": "ananyapic"
            }
        ],
        "groupName": "Project Team",
        "groupImage": "groupimg123",
        "groupAdmin": ["689823b7d6f9e7d01ea8f958"],
        "createdAt": "2025-08-15T10:22:41.520Z",
        "updatedAt": "2025-08-17T08:30:12.210Z",
        "__v": 0
        },
        {
        "lastMessage": {
            "createdAt": "2025-08-16T15:45:21.301Z"
        },
        "_id": "889983bf503e8436b74022f3",
        "isGroup": false,
        "participants": [
            {
            "_id": "6899772bd60fae3d4170b10c",
            "firstName": "second",
            "lastName": "singh",
            "profilePic": "ntyyn"
            },
            {
            "_id": "6899992cd70fae3d4170b14d",
            "firstName": "Rahul",
            "lastName": "Mehta",
            "profilePic": "rahulpic"
            }
        ],
        "groupName": null,
        "groupImage": null,
        "groupAdmin": [],
        "createdAt": "2025-08-16T15:45:21.308Z",
        "updatedAt": "2025-08-16T15:45:21.308Z",
        "__v": 0
        },
        {
        "lastMessage": {
            "createdAt": "2025-08-17T20:11:10.643Z"
        },
        "_id": "989984cf603e9436b75033a4",
        "isGroup": true,
        "participants": [
            {
            "_id": "689823b7d6f9e7d01ea8f958",
            "firstName": "Prince",
            "lastName": "singh",
            "profilePic": "fgbdr"
            },
            {
            "_id": "6899772bd60fae3d4170b10c",
            "firstName": "second",
            "lastName": "singh",
            "profilePic": "ntyyn"
            },
            {
            "_id": "6899992cd70fae3d4170b14e",
            "firstName": "Ananya",
            "lastName": "Sharma",
            "profilePic": "ananyapic"
            }
        ],
        "groupName": "Weekend Plans",
        "groupImage": "weekendgroup",
        "groupAdmin": ["6899992cd70fae3d4170b14e"],
        "createdAt": "2025-08-17T20:11:10.650Z",
        "updatedAt": "2025-08-18T07:55:44.002Z",
        "__v": 0
        },
        {
        "lastMessage": {
            "createdAt": "2025-08-11T05:38:55.937Z"
        },
        "_id": "689981ef303e6416b74089d1",
        "isGroup": false,
        "participants": [
            {
            "_id": "6899772bd60fae3d4170b10c",
            "firstName": "second",
            "lastName": "singh",
            "profilePic": "ntyyn"
            },
            {
            "_id": "689823b7d6f9e7d01ea8f958",
            "firstName": "Prince",
            "lastName": "singh",
            "profilePic": "fgbdr"
            }
        ],
        "groupName": null,
        "groupImage": null,
        "groupAdmin": [],
        "createdAt": "2025-08-11T05:38:55.944Z",
        "updatedAt": "2025-08-11T05:38:55.944Z",
        "__v": 0
        },
        {
        "lastMessage": {
            "createdAt": "2025-08-15T10:22:41.512Z"
        },
        "_id": "789982af403e7426b74011e2",
        "isGroup": true,
        "participants": [
            {
            "_id": "689823b7d6f9e7d01ea8f958",
            "firstName": "Prince",
            "lastName": "singh",
            "profilePic": "https://cdn.pixabay.com/photo/2024/05/26/10/15/bird-8788491_1280.jpg"
            },
            {
            "_id": "6899992cd70fae3d4170b14d",
            "firstName": "Rahul",
            "lastName": "Mehta",
            "profilePic": 'https://cdn.pixabay.com/photo/2024/05/26/10/15/bird-8788491_1280.jpg'
            },
            {
            "_id": "6899992cd70fae3d4170b14e",
            "firstName": "Ananya",
            "lastName": "Sharma",
            "profilePic": "ananyapic"
            }
        ],
        "groupName": "Project Team",
        "groupImage": "groupimg123",
        "groupAdmin": ["689823b7d6f9e7d01ea8f958"],
        "createdAt": "2025-08-15T10:22:41.520Z",
        "updatedAt": "2025-08-17T08:30:12.210Z",
        "__v": 0
        },
        {
        "lastMessage": {
            "createdAt": "2025-08-16T15:45:21.301Z"
        },
        "_id": "889983bf503e8436b74022f3",
        "isGroup": false,
        "participants": [
            {
            "_id": "6899772bd60fae3d4170b10c",
            "firstName": "second",
            "lastName": "singh",
            "profilePic": "ntyyn"
            },
            {
            "_id": "6899992cd70fae3d4170b14d",
            "firstName": "Rahul",
            "lastName": "Mehta",
            "profilePic": "rahulpic"
            }
        ],
        "groupName": null,
        "groupImage": null,
        "groupAdmin": [],
        "createdAt": "2025-08-16T15:45:21.308Z",
        "updatedAt": "2025-08-16T15:45:21.308Z",
        "__v": 0
        },
        {
        "lastMessage": {
            "createdAt": "2025-08-17T20:11:10.643Z"
        },
        "_id": "989984cf603e9436b75033a4",
        "isGroup": true,
        "participants": [
            {
            "_id": "689823b7d6f9e7d01ea8f958",
            "firstName": "Prince",
            "lastName": "singh",
            "profilePic": "fgbdr"
            },
            {
            "_id": "6899772bd60fae3d4170b10c",
            "firstName": "second",
            "lastName": "singh",
            "profilePic": "ntyyn"
            },
            {
            "_id": "6899992cd70fae3d4170b14e",
            "firstName": "Ananya",
            "lastName": "Sharma",
            "profilePic": "ananyapic"
            }
        ],
        "groupName": "Weekend Plans",
        "groupImage": "weekendgroup",
        "groupAdmin": ["6899992cd70fae3d4170b14e"],
        "createdAt": "2025-08-17T20:11:10.650Z",
        "updatedAt": "2025-08-18T07:55:44.002Z",
        "__v": 0
        },
    ]
        

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
        // const allConvo = dummyArr.map(convo => {
        //     if (convo.isGroup) {
        //         // Group chat display
        //         return {
        //             convoId: convo._id,
        //             name: convo.groupName,
        //             profilePic: convo.groupImage || '/default-group.png',
        //             lastMessage: convo.lastMessage?.text || '',
        //             createdAt: formatChatTimestamp(convo.lastMessage?.createdAt)
        //         };
        //     } else {
        //         // One-to-one chat
        //         const otherUser = convo.participants.find(p => p._id !== userId); // assuming you already filtered out logged-in user
        //         return {
        //             convoId: convo._id,
        //             name: `${otherUser.firstName} ${otherUser.lastName}`,
        //             profilePic: otherUser.profilePic || '/default-user.png',
        //             lastMessage: convo.lastMessage?.text || '',
        //             createdAt: formatChatTimestamp(convo.lastMessage?.createdAt)
        //         };
        //     }
        // });
        // setConvoList(allConvo)

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

            const allConvo = resData.data.map(convo => {
                if (convo.isGroup) {
                    // Group chat display
                    return {
                        convoId: convo._id,
                        name: convo.groupName,
                        profilePic: convo.groupImage || '/default-group.png',
                        lastMsg: convo.lastMessage,
                        // lastMessage: convo.lastMessage?.text || '',
                        // lastSeen: convo.lastSeen,
                        sender: convo.lastMessage?.sender,
                        createdAt: formatChatTimestamp(convo.lastMessage?.createdAt)
                    };
                } else {
                    // One-to-one chat
                    const otherUser = convo.participants.find(p => p._id !== userId); // assuming you already filtered out logged-in user
                    return {
                        convoId: convo._id,
                        name: `${otherUser.firstName} ${otherUser.lastName}`,
                        profilePic: otherUser.profilePic || '/default-user.png',
                        lastMsg: convo.lastMessage,
                        // lastMsgId: convo.lastMessage.msgId,
                        // lastMessage: convo.lastMessage?.text || '',
                        sender: convo.lastMessage?.sender,
                        lastSeen:  formatChatTimestamp(convo.lastSeen),
                        createdAt: formatChatTimestamp(convo.lastMessage?.createdAt)
                    };
                }
            });

            setConvoList(allConvo); // update state
            console.log("convo list: ", resData)
        } catch (error) {
            console.error("Error fetching convos", error)
        } finally{
            setLoading(false)
        }
    }
    if(convoList) console.log("After resData: ", convoList)

    useEffect(()=>{
       fetchAllChats()
    //    if(!convoList) fetchAllChats()

        socket.on("updatedConvoList", (data)=>{
            setConvoList((prev)=>{
                // remove old entry
                const filtered = prev.filter((c)=> c._id!==data.convoId)
                return [{
                    ...data, 
                    // _id: data.convoId
                    convoId: data.convoId,
                }, ...filtered]
            })
        })
        return () => socket.off("updatedConvoList")
    }, [])

    const displayMessage = (index) =>{
        // setActiveChatIdx(index)
        console.log("convoList displayMessage: ", convoList)
        const selectedChat = convoList[index];
        if(!selectedChat) return 

        const convoId = selectedChat.convoId
        // setActiveChat(selectedChat)
        // setActiveConvoId(convoId)
        dispatch(setActiveChat({
            chat: selectedChat,
            convoId: selectedChat.convoId,
        }))

        
        navigate(`/conversations/${convoId}`, 
            {state: {activeChat:selectedChat}}
        )
        console.log("convoId", convoId)
        console.log("activeConvoId", activeConvoId)
    }

    
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
                        <button key={index} onClick={()=>displayMessage(index)} className={`h-18 my-auto cursor-pointer border-b border-slate-400 hover:bg-gray-500 ${activeConvoId===data.convoId ? 'bg-gray-400 dark:bg-gray-600 text-black dark:text-white':''}`}>
                            <div className='w-full flex items-center justify-between px-2 '>
                                <div className='w-full flex items-center gap-2 justify-center'>
                                    <img src={data.profilePic ? data.profilePic : dummyDp} alt={data.name} className='w-12 h-12 rounded-lg object-cover'/>
                                    <div className='w-full flex flex-col items-start'>
                                        <div className='w-full flex items-center justify-between'>
                                            <p className='text-lg font-lg capitalize'>{data.name}</p>
                                            <span className='opacity-90 font-sm text-xs'>{data.createdAt}</span>
                                        </div>
                                        <div className='opacity-75 text-sm flex gap-2 items-center'>
                                            {/* <i className='mt-[1px]'><MsgIndicator message={data.lastMsg} totalReceivers={1}/></i> */}
                                            <span>{data.lastMsg.text}</span>
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
        {outlet ? (
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
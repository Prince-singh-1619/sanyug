import React, { useState, useEffect, useRef } from 'react'
import { IoClose } from 'react-icons/io5'
import { MdSearch, MdPersonAdd } from 'react-icons/md'
import { BiUser } from 'react-icons/bi'
import SummaryApi from '../helpers/SummaryApi'
import { useDispatch, useSelector } from 'react-redux'
import { addNewConvo } from '../redux/slices/convoSlice'
import { getSocket } from '../socket/socket'

const UserSearchPopup = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResult, setSearchResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [error, setError] = useState('')
  const popupRef = useRef(null)
  const dispatch = useDispatch()

  const { authToken, userData } = useSelector(state => state.user)
  const userId = userData?._id

  const socket = getSocket();

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setSearchQuery('')
        setError('')
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  // Close popup on Escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setSearchQuery('')
        setError('')
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a username to search')
      setSearchResult(null)
      return
    }

    setIsLoading(true)
    setError('')
    setSearchResult(null)

    try {
      const response = await fetch(`${SummaryApi.searchUser.url}?username=${encodeURIComponent(searchQuery.trim())}&userId=${userId}`, {
        method: SummaryApi.searchUser.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      })

      const data = await response.json()

      if (response.ok) {
        setSearchResult(data.user)
        console.log('userId: ', data.user._id)
      } else {
        setError(data.message || 'User not found')
        setSearchResult(null)
      }
    } catch (error) {
      setError('Failed to search user. Please try again.')
      console.error(error)
      setSearchResult(null)
    } finally {
      setIsLoading(false)
    }
  }

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
          participants: [userId, searchResult._id]
        })
      })

      const resData = await res.json();

      if (!res.ok) {
        console.error('Error creating/fetching conversation:', resData.message);
        return;
      }
      if(resData.success){
        // console.log("newConvo", resData)
        const convo = resData.data;

        let newConvo;
        if (convo.isGroup) {
          // Group chat
          newConvo = {
            convoId: convo._id,
            name: convo.groupName,
            profilePic: convo?.groupImage || "",
            lastMsg: convo?.lastMessage || null,
            sender: convo?.lastMessage?.sender || null,
            participants: convo.participants,
            createdAt: convo?.lastMessage?.createdAt ? formatChatTimestamp(convo.lastMessage.createdAt) : formatChatTimestamp(convo.createdAt),
            unreadCount: convo?.unreadCount || 0,
          };
        } else {
          // One-to-one chat
          const otherUser = convo.participants.find((p) => p._id !== userId);
          newConvo = {
            convoId: convo._id,
            name: `${otherUser.firstName} ${otherUser.lastName}`,
            profilePic: otherUser?.profilePic || "",
            lastMsg: convo?.lastMessage || null,
            sender: convo?.lastMessage?.sender || null,
            participants: convo.participants,
            lastSeen: formatChatTimestamp(otherUser.lastSeen),
            createdAt: convo?.lastMessage?.createdAt ? formatChatTimestamp(convo.lastMessage.createdAt) : formatChatTimestamp(convo.createdAt),
            unreadCount: convo?.unreadCount || 0,
          };
        }
        console.log("newConvo after formating..", newConvo)

        dispatch(addNewConvo( { newConvo } ))
        socket.emit("new-convo-added", ({newConvoForB:convo, userId}))
      }

      console.log('Conversation created/fetched:', resData);
      onClose()
    } 
    catch (error) {
      console.error("Error adding to chat: ", error)
    } 
    finally{
      setSearchQuery('')
      setIsAdding(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleClose = () =>{
    setSearchQuery('')
    setError('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div 
        ref={popupRef}
        className="border rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 ease-out animate-in fade-in zoom-in"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <p className="text-4xl font-semibold">
            Add New Chat
          </p>
          <button
            onClick={handleClose}
            className="p-2 rounded-full border hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <IoClose className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Search Section */}
        <div className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium  mb-2">
              Search by Username
            </label>
            <div className="relative flex gap-2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MdSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter username..."
                className="block w-8/10 pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-300 dark:bg-gray-700 dark:text-white transition-all duration-200"
              />
              <button onClick={handleSearch} disabled={isLoading} className="min-w-12 max-w-24  bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2">
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Search"
                )}
              </button>
            </div>
            {/* Error Message */}
            {error && (
              <p className="text-red-500  text-md">{error}</p>
            )}
          </div>

          {/* Search Result */}
          {searchResult && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  {searchResult.profilePic ? (
                    <img 
                      src={searchResult.profilePic} 
                      alt={searchResult.firstName}
                      className="w-12 h-12 rounded-lg object-cover lazy-loading"
                    />
                  ) : (
                    <BiUser className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {searchResult.firstName} {searchResult.lastName}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    @{searchResult.username}
                  </p>
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
      </div>
    </div>
  )
}

export default UserSearchPopup 
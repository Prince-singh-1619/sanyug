import React from 'react'
import {motion} from 'motion/react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setActiveChat } from '../redux/slices/chatSlice'
import { setActiveConvo } from '../redux/slices/convoSlice'
// import { setActiveChat } from '../redux/slices/convoSlice'

const ChatDropdown = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleActiveChat = () =>{
    dispatch(setActiveChat({ chat: null }))
    dispatch(setActiveConvo({ newConvoId: null, participants: [] }) )
    navigate('/conversations')
  }

  return (
    <div className='z-50'>
        <motion.div  
          initial={{y:-25}} 
          animate={{y:0}} 
          transition={{duration:0.3,}}
          style={{zIndex:0}}
          className=' z-50 bg-slate-300 dark:bg-[#151515] border rounded-lg flex flex-col items-center text-nowrap'>
           
            <button className='hidden max-[425px]:block w-full p-2 rounded-lg min-w-20 text-center hover:bg-slate-300 dark:hover:bg-neutral-800 transition-colors cursor-pointer'>Refresh</button>
            <div className="h-[1px] w-full bg-gray-300 dark:bg-gray-600"></div>

            <button className='hidden max-[425px]:block w-full p-2 rounded-lg min-w-20 text-center hover:bg-slate-300 dark:hover:bg-neutral-800 transition-colors cursor-pointer'>Search</button>
            <div className="h-[1px] w-full bg-gray-300 dark:bg-gray-600"></div>

            <Link onClick={handleActiveChat} to={'/conversations'} className='w-full p-2 rounded-lg min-w-20 text-center hover:bg-slate-300 dark:hover:bg-neutral-800 transition-colors cursor-pointer'>Close chat</Link>
        </motion.div>
    </div>
  )
}

export default ChatDropdown
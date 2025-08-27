import React from 'react'
import {motion} from 'motion/react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setActiveChat } from '../redux/slices/chatSlice'

const ChatDropdown = () => {
  const dispatch = useDispatch()
  
  const handleActiveChat = () =>{
    dispatch(setActiveChat({
      chat: null,
      convoId: null,
    }))
  }

  return (
    <div className='z-50'>
        <motion.div  
            initial={{y:-25}} 
            animate={{y:0}} 
            transition={{duration:0.3,}}
            style={{zIndex:0}}
        className='absolute z-50 bg-slate-200 dark:bg-neutral-900 border rounded-lg ml-8 max-md:-ml-18 mt-8 flex flex-col items-center text-nowrap'>
            <Link onClick={handleActiveChat} to={'/conversations'} className='w-full p-2 rounded-lg min-w-20 text-center hover:bg-slate-300 dark:hover:bg-neutral-800 transition-colors cursor-pointer'>Close chat</Link>
            <div className="h-[1px] w-full bg-gray-300 dark:bg-gray-600"></div>
        </motion.div>
    </div>
  )
}

export default ChatDropdown
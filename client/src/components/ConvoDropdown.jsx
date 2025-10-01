import React, { useEffect, useRef, useState } from 'react'
import {motion} from 'motion/react'
import { Link } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import { MdOutlineSettings, MdPersonAddAlt1 } from 'react-icons/md'
import { CgProfile } from 'react-icons/cg'

const ConvoDropdown = ({isOpen, onClose}) => {

    const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark")
    useEffect(()=>{
        if(theme==="dark"){
            document.documentElement.classList.add("dark")
        }
        else{
            document.documentElement.classList.remove("dark")
        }
        localStorage.setItem("theme", theme)
    }, [theme])
    const handleTheme = () =>{
        setTheme(theme==="dark" ? "light" : "dark")
    }

    const dialogRef = useRef(null)
    
    
    useEffect(()=>{
        const handleClickOutside = (e) =>{
            if(dialogRef.current && !dialogRef.current.contains(e.target)){
                onClose()
            }
        }
        
        if(isOpen){
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () =>{
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen, onClose])

    if(!isOpen) return null
    

  return (
    <div className='inset-0 backdrop-blur-xs z-50'>
        <motion.div  ref={dialogRef}
          initial={{y:-25}} 
          animate={{y:0}} 
          transition={{duration:0.3,}}
          style={{zIndex:0}}
          className=' z-50 bg-slate-300 dark:bg-[#151515] border rounded-lg flex flex-col items-center text-nowrap'>
            
            <div className='w-full p-2 flex gap-2 rounded-lg min-w-20 text-center hover:bg-slate-300 dark:hover:bg-neutral-800 transition-colors cursor-pointer'>
                <ThemeToggle/>
                <span onClick={handleTheme}>Theme</span>
            </div>
            <div className="h-[1px] w-full bg-gray-300 dark:bg-gray-600"></div>
            
            {/* <button className='w-full p-2 flex gap-2 rounded-lg min-w-20 text-center hover:bg-slate-300 dark:hover:bg-neutral-800 transition-colors cursor-pointer'>
                <i className='text-xl'> <MdPersonAddAlt1/> </i>
                <span>Add to Chat</span>
            </button>
            <div className="h-[1px] w-full bg-gray-300 dark:bg-gray-600"></div> */}
            
            <Link to="/my-profile" className='w-full p-2 flex gap-2 rounded-lg min-w-20 text-center hover:bg-slate-300 dark:hover:bg-neutral-800 transition-colors cursor-pointer'>
                <i className='text-xl'> <CgProfile/> </i>
                <span>My Profile</span>
            </Link>
            <div className="h-[1px] w-full bg-gray-300 dark:bg-gray-600"></div>
            
            <Link to="/setting" className='w-full p-2 flex gap-2 rounded-lg min-w-20 text-center hover:bg-slate-300 dark:hover:bg-neutral-800 transition-colors cursor-pointer'>
                <i className='text-xl'> <MdOutlineSettings/> </i>
                <span>Settings</span>
            </Link>
            <div className="h-[1px] w-full bg-gray-300 dark:bg-gray-600"></div>
            
            {/* <Link className='w-full p-2 rounded-lg min-w-20 text-center hover:bg-slate-300 dark:hover:bg-neutral-800 transition-colors cursor-pointer'>Close chat</Link> */}
        </motion.div>
    </div>
  )
}

export default ConvoDropdown
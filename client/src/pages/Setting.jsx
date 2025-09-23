import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
// import { useState } from "react";
// import { Switch } from "@/components/ui/switch";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import sentSound from '../assets/notify 2.mp3'
import { setChatBgWallpaper, setIsDefaultBg, setIsSound } from '../redux/slices/settingSlice'
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import { MdClose } from 'react-icons/md';
import defaultDoodleBg from '../assets/1.png'
import ImageToBase64 from '../helpers/ImageToBase64';

const Setting = () => {
  // const [soundEnabled, setSoundEnabled] = useState(true);
  // const [darkMode, setDarkMode] = useState(false);
  // const [showOnline, setShowOnline] = useState(true);
  // const [readReceipts, setReadReceipts] = useState(true);
  // const [notifyMessages, setNotifyMessages] = useState(true);
  // const [notifyGroups, setNotifyGroups] = useState(false);
  const [customLoading, setCustomLoading] = useState(false)
  const [defaultLoading, setDefaultLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { isSound, isDefaultBg, chatBgWallpaper } = useSelector(state => state.settings)

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark")
  useEffect(()=>{
    if(theme==="dark"){
      document.documentElement.classList.add("dark")
      // setDarkMode(true);
    }
    else{
      document.documentElement.classList.remove("dark")
      // setDarkMode(false);
    }
    localStorage.setItem("theme", theme)
  }, [theme])
  const themeHandler = () =>{
    setTheme(theme==="dark" ? "light" : "dark")
  }

  const handleWallpaper = async(e) => {
    setCustomLoading(true)
    try {
      const file = e.target.files[0];
      const imageFile = await ImageToBase64(file, {maxSizeMB:100, maxWidthOrHeight:5000, initialQuality:1})
      dispatch(setChatBgWallpaper({bgWp:imageFile})) 
      dispatch(setIsDefaultBg(false)) 
    } catch (error) {
      console.log("couldn't set custom Bg",error)
    }
    setCustomLoading(false)
  };

  const handleDefault = async() => {
    setDefaultLoading(true)
    dispatch(setIsDefaultBg(true))
    setDefaultLoading(false)
  };

  return (
    <section className="h-[99vh] flex">
      <div className='max-[425px]:hidden'> <Sidebar/> </div>

      <div className="relative h-fit max-md:w-9/10 min-md:w-1/2 mx-auto bg-slate-300 dark:bg-[#151515] shadow-xl rounded-lg p-4 flex flex-col gap-6 mt-8">
        <h1 className="text-2xl font-bold ">
          Settings
        </h1>

        {/* Sound Toggle */}
        <div className="flex justify-between items-center">
          <span className="text-gray-700 dark:text-gray-300">Sound Effects</span>
          <div
            onClick={() => dispatch(setIsSound())}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
              isSound ? "bg-green-500" : "bg-gray-400"
            }`}
          >
            <span
              className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-1000 ${
                isSound ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </div>
        </div>

        {/* Dark Mode */}
        <div className="flex justify-between items-center">
          <span className="text-gray-700 dark:text-gray-300">Dark Mode</span>
          <div
            onClick={themeHandler}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
              theme==="dark" ? "bg-slate-200" : "bg-[#1a1a1a]"
            }`}
          >
            <div
              className={`w-4 h-4 bg-white dark:bg-black rounded-full shadow-md transform transition ${
                theme==="dark" ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </div>
        </div>

        {/* Wallpaper Selector */}
        <div className=''>
          <h2 className="text-lg font-semibold text-nowrap "> Chat Wallpaper </h2>

          <div className="h-fit flex max-lg:flex-col justify-around items-center  mt-4 gap-4">
            <input id='bg-wallpaper' type='file' name='bg-wallpaper' accept="image/*" onChange={handleWallpaper} className='hidden' />
            <label htmlFor='bg-wallpaper' className='min-w-34 h-10 px-4 py-2 bg-green-500 dark:bg-green-600 text-black dark:text-[#dadada] rounded-sm cursor-pointer flex items-center justify-center'>
              { customLoading ? (<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>) : (<span>Select from file</span>) }
            </label>
            <img src={isDefaultBg ? defaultDoodleBg : chatBgWallpaper} alt='chat Bg wallpaper' className={`w-36 h-36 object-cover border rounded-lg ${isDefaultBg ? 'invert-100 dark:invert-0' : ''}`}/>
            <button onClick={handleDefault} className="min-w-30 h-10 px-4 py-2  bg-blue-500 dark:bg-blue-600 text-black dark:text-[#dadada] rounded-sm text-nowrap flex items-center justify-center" >
              { defaultLoading ? (<div className="w-5 h-5 text-center border-2 border-white  border-t-transparent rounded-full animate-spin"></div>) : ("Keep default") }
            </button>
          </div>
        </div>

        {/* Privacy */}
        {/* <div>
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            Privacy
          </h2>
          <div className="flex justify-between mt-2">
            <span className="text-gray-600 dark:text-gray-300">Show Online Status</span>
            <input
              type="checkbox"
              checked={showOnline}
              onChange={() => setShowOnline(!showOnline)}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-gray-600 dark:text-gray-300">Read Receipts</span>
            <input
              type="checkbox"
              checked={readReceipts}
              onChange={() => setReadReceipts(!readReceipts)}
            />
          </div>
        </div> */}

        {/* Notifications */}
        {/* <div>
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            Notifications
          </h2>
          <div className="flex justify-between mt-2">
            <span className="text-gray-600 dark:text-gray-300">Messages</span>
            <input
              type="checkbox"
              checked={notifyMessages}
              onChange={() => setNotifyMessages(!notifyMessages)}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-gray-600 dark:text-gray-300">Group Chats</span>
            <input
              type="checkbox"
              checked={notifyGroups}
              onChange={() => setNotifyGroups(!notifyGroups)}
            />
          </div>
        </div> */}

        <div onClick={()=>navigate(-1)} className="absolute top-2 right-2 text-xl cursor-pointer"> <MdClose/> </div> 
        
      </div>
    </section>
  );
}

export default Setting
import React, { useEffect, useState } from 'react'
import { MdDarkMode, MdLightMode } from 'react-icons/md'

const ThemeToggle = () => {
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

    const themeHandler = () =>{
        setTheme(theme==="dark" ? "light" : "dark")
    }

    return (
        <button onClick={themeHandler} className="p-2 w-12 h-12 rounded-full flex justify-center
        items-center bg-slate-200 dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 cursor-pointer">
            {theme === "dark" ? <MdLightMode size={24} /> : <MdDarkMode size={24} />}
        </button>
    )
}

export default ThemeToggle
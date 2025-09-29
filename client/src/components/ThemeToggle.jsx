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
        <button onClick={themeHandler} className="flex justify-center items-center cursor-pointer">
            {theme === "dark" ? <MdLightMode size={24} /> : <MdDarkMode size={24}  />}
        </button>
    )
}

export default ThemeToggle
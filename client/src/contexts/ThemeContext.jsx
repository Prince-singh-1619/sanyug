// import React, { createContext, useContext, useEffect, useState } from 'react'

// const ThemeContext = createContext()

// export const useTheme = () => {
//   const context = useContext(ThemeContext)
//   if (!context) {
//     throw new Error('useTheme must be used within a ThemeProvider')
//   }
//   return context
// }

// export const ThemeProvider = ({ children }) => {
//   const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark")
  
//   useEffect(() => {
//     if (theme === "dark") {
//       document.documentElement.classList.add("dark")
//     } else {
//       document.documentElement.classList.remove("dark")
//     }
//     localStorage.setItem("theme", theme)
//   }, [theme])

//   const toggleTheme = () => {
//     setTheme(theme === "dark" ? "light" : "dark")
//   }

//   return (
//     <ThemeContext.Provider value={{ theme, toggleTheme }}>
//       {children}
//     </ThemeContext.Provider>
//   )
// }

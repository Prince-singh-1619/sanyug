// import React, { useEffect, useState } from 'react'

// const useTheme = () => {
//     const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

//     useEffect(() => {
//     const checkTheme = () => {
//         const currentTheme = localStorage.getItem("theme") || "dark";
//         setTheme(currentTheme);
//     };

//     // Check theme on mount
//     checkTheme();

//     // Listen for storage changes
//     window.addEventListener('storage', checkTheme);
    
//     // Create a custom event listener for theme changes
//     const handleThemeChange = () => checkTheme();
//     window.addEventListener('themeChange', handleThemeChange);

//     return () => {
//         window.removeEventListener('storage', checkTheme);
//         window.removeEventListener('themeChange', handleThemeChange);
//     };
//     }, []);

//     return theme;
// }

// export default useTheme
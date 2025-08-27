// import { useState, useEffect } from "react";

// export function useDarkMode() {
//   const [isDark, setIsDark] = useState(false);

//   // On mount, read the saved mode or system preference
//   useEffect(() => {
//     const savedMode = localStorage.getItem("darkMode");
//     if (savedMode === "dark") {
//       setIsDark(true);
//       document.documentElement.classList.add("dark");
//     } else if (savedMode === "light") {
//       setIsDark(false);
//       document.documentElement.classList.remove("dark");
//     } else {
//       // default to system preference
//       const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
//       setIsDark(prefersDark);
//       if (prefersDark) document.documentElement.classList.add("dark");
//     }
//   }, []);

//   const toggleDarkMode = () => {
//     if (isDark) {
//       document.documentElement.classList.remove("dark");
//       localStorage.setItem("darkMode", "light");
//     } else {
//       document.documentElement.classList.add("dark");
//       localStorage.setItem("darkMode", "dark");
//     }
//     setIsDark(!isDark);
//   };

//   return [isDark, toggleDarkMode];
// }

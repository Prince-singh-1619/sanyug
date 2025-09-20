import { useState, useRef, useEffect } from "react";

export default function useResizable(initialWidth = 25, min = 20, max = 50) {
  const savedWidth = localStorage.getItem("leftPanelWidth"); // read once
  const [width, setWidth] = useState(savedWidth ? parseFloat(savedWidth) : initialWidth);

  const isDragging = useRef(false);
  const widthRef = useRef(width); // keeps the latest width without re-renders

  // Sync width state with localStorage + ref
  useEffect(() => {
    localStorage.setItem("leftPanelWidth", width);
    widthRef.current = width;
  }, [width]);

  const handleMouseDown = () => {
    if (window.innerWidth < 768) return;
    isDragging.current = true;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;

    const screenWidth = window.innerWidth;
    let newWidth = (e.clientX / screenWidth) * 100;

    // Clamp between min and max
    if (newWidth < min) newWidth = min;
    if (newWidth > max) newWidth = max;

    setWidth(newWidth);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  // useEffect(() => {
  //   window.addEventListener("mousemove", handleMouseMove);
  //   window.addEventListener("mouseup", handleMouseUp);

  //   return () => {
  //     window.removeEventListener("mousemove", handleMouseMove);
  //     window.removeEventListener("mouseup", handleMouseUp);
  //   };
  // }, []);

  // resize listener for mobile override
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setWidth(100); // force full width
      } else {
        // restore from saved value or fallback to initialWidth
        const saved = localStorage.getItem("leftPanelWidth");
        setWidth(saved ? parseFloat(saved) : initialWidth);
      }
    };

    handleResize(); // run on mount
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return { width, handleMouseDown };
}

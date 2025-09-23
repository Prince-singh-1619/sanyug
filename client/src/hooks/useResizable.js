import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { setLeftPanelWidth } from "../redux/slices/settingSlice";

export default function useResizable(initialWidth = 25, min = 20, max = 50) {
  const dispatch = useDispatch()

  // const savedWidth = localStorage.getItem("leftPanelWidth"); // read once
  const { leftPanelWidth } = useSelector(state => state.settings)
  const savedWidth = leftPanelWidth

  const [width, setWidth] = useState(savedWidth ? parseFloat(savedWidth) : initialWidth);

  const isDragging = useRef(false);
  const widthRef = useRef(width); // keeps the latest width without re-renders

  // Sync width state with localStorage + ref
  useEffect(() => {
    // localStorage.setItem("leftPanelWidth", width);
    dispatch(setLeftPanelWidth({ newWidth:leftPanelWidth }))
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

  // resize listener for mobile override
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setWidth(100); // force full width
      } else {
        // restore from saved value or fallback to initialWidth
        // const saved = localStorage.getItem("leftPanelWidth");
        const saved = leftPanelWidth;
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

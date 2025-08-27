import { useRef, useState } from "react";

const ResizableDiv = ({className="", children}) => {
  const divRef = useRef(null);
  const [width, setWidth] = useState(400);

  const handleMouseDown = (e) => {
    const startX = e.clientX;
    const startWidth = divRef.current.offsetWidth;

    const onMouseMove = (e) => {
      const newWidth = startWidth + (e.clientX - startX);
      setWidth(newWidth); // minimum width
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  return (
    <div ref={divRef} style={{ width: width }} className={`relative ${className}`}>
        {children}
      {/* Custom handle on right mid */}
      <div onMouseDown={handleMouseDown} className="absolute top-1/2 right-0 w-2 h-10 cursor-ew-resize bg-gray-500 rounded-lg flex flex-col justify-around items-center">
        <span className="w-1 h-1 bg-white"></span>
        <span className="w-1 h-1 bg-white"></span>
        <span className="w-1 h-1 bg-white"></span>
      </div>
    </div>
  );
}

export default ResizableDiv
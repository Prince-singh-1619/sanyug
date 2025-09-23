import React, { useEffect, useRef, useState } from 'react'
import { IoCloseSharp } from 'react-icons/io5'
import dummyDp from '../assets/person-dummy.svg'
import { toast } from 'react-hot-toast';

const ImagePopup = ({url, lowRes, isOpen, onClose}) => {
    url='https://res.cloudinary.com/dekeq9j99/image/upload/v1758523632/ejxpu1ntgpqtqhzalirj.png'
    const dialogRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [highRes, setHighRes] = useState(lowRes)

    const fetchHighRes = async() =>{
        console.log("fetchHighRes called")
        setLoading(true)
        try {
            const response = await fetch(url);
            if (!response.ok) {
                toast.error("Coudn't fetch Dp")
                console.log("Failed to fetch image ", response.status)
                return;
            }

            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);
            setHighRes(objectUrl);  // usable like an uploaded file
        } catch (err) {
            console.error("Error fetching Cloudinary image:", err);
        }
        setLoading(false)
        console.log("fetchHighRes completed")
    }
    useEffect(()=>{
        fetchHighRes()
    }, [url])

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
    <section className='fixed inset-0 backdrop-blur-xs w-full h-full flex justify-center items-center z-50' >
        <div ref={dialogRef} className='w-fit min-md:min-w-100 max-md:w-[85%] h-fit p-2 bg-transparent rounded-xl shadow-lg relative'>
            <img src={highRes || dummyDp} alt='user Dp' className='h-full w-full object-cover'/>
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-xl">
                    <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}            
            <button onClick={onClose} className='absolute top-4 right-4 text-2xl rounded-full border '><IoCloseSharp/> </button>
        </div>
    </section>
  )
}

export default ImagePopup
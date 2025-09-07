import React from 'react'
import { MdOutlineAccessTime } from 'react-icons/md';
import { FaCheck, FaCheckDouble } from "react-icons/fa6";
import { LuCheck, LuCheckCheck } from 'react-icons/lu';

const MsgIndicator = ({message, totalReceivers}) => {
    const { _id, deliveredTo=[], readBy=[] } = message
    
    // const userData = JSON.parse(localStorage.getItem("userData"))
    // const userId = userData?.userId

    // not sent yet
    if (_id.length === 13 && /^\d+$/.test(_id)) {
        return <MdOutlineAccessTime/>
    }
    // sent to DB
    if (_id.length === 24 && /^[0-9a-fA-F]+$/.test(_id)) {
        const deliveredCount = deliveredTo.length
        const readCount = readBy.length

        if(readCount===totalReceivers){
            // return <FaCheckDouble style={{color: "blue"}}/>
            return <LuCheckCheck className='text-[#FF4500] dark:text-[#FFD700]'/>
        }
        else if(deliveredCount===totalReceivers){
            return <LuCheckCheck/>
        }
        else{
            // return <FaCheck/>
            return <LuCheck/>
        }
    }

    return <MdOutlineAccessTime/>
}

export default MsgIndicator
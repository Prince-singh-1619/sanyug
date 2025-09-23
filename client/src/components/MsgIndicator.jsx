import React from 'react'
import { MdOutlineAccessTime } from 'react-icons/md';
import { FaCheck, FaCheckDouble } from "react-icons/fa6";
import { LuCheck, LuCheckCheck } from 'react-icons/lu';

const MsgIndicator = ({message}) => {
    const { _id, deliveredTo=[], readBy=[] } = message
    // console.log("MsgIndicator render:", message._id, message.deliveredTo);
    // console.log("totalReceivers prop type:", typeof totalReceivers, totalReceivers);

    // const userData = JSON.parse(localStorage.getItem("userData"))
    // const userId = userData?._id

    // not sent yet
    if (_id.length === 13 && /^\d+$/.test(_id)) {
        return <MdOutlineAccessTime/>
    }
    // sent to DB
    if (_id.length === 24 && /^[0-9a-fA-F]+$/.test(_id)) {
        const totalReceivers = message.totalReceivers || 1; // default to 1 if undefined
        const deliveredCount = deliveredTo?.length || 0;
        const readCount = readBy?.length || 0;
        // const totalReceivers_1 = totalReceivers || 1;

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
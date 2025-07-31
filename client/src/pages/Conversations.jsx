import React from 'react'
import Message from './Message'
import { FaEye } from 'react-icons/fa'

import pic1 from '../assets/hero image.png'
import pic2 from '../assets/prince-2.png'
import pic3 from '../assets/tabish.jpg'
import pic4 from '../assets/crsl-l1.jpg'
import pic5 from '../assets/pratham.jpg'
import { MdPersonAddAlt1 } from 'react-icons/md'
import { IoMdMenu } from "react-icons/io";


const Conversations = () => {

    const convoList = [
        {
            profilePic: pic1,
            name: 'Prince singh',
            lastMessage: "Bye",
            createdAt: "10:24 am"
        },
        {
            profilePic: pic2,
            name: 'Abhinav kushwaha',
            lastMessage: "chalo",
            createdAt: "08:04 pm"
        },
        {
            profilePic: pic3,
            name: 'Vishnu pandey',
            lastMessage: "Kya maharaj",
            createdAt: "11:30 am"
        },
        {
            profilePic: pic4,
            name: 'Akhil kumar',
            lastMessage: "Banega",
            createdAt: "06:40 pm"
        },
        {
            profilePic: pic5,
            name: 'Akhilesh gupta',
            lastMessage: "sab khatam",
            createdAt: "11:30 pm"
        },
        {
            profilePic: pic1,
            name: 'Prince singh',
            lastMessage: "Bye",
            createdAt: "10:24 am"
        },
        {
            profilePic: pic2,
            name: 'Abhinav kushwaha',
            lastMessage: "chalo",
            createdAt: "08:04 pm"
        },
        {
            profilePic: pic3,
            name: 'Vishnu pandey',
            lastMessage: "Kya maharaj",
            createdAt: "11:30 am"
        },
        {
            profilePic: pic4,
            name: 'Akhil kumar',
            lastMessage: "Banega",
            createdAt: "06:40 pm"
        },
        {
            profilePic: pic5,
            name: 'Akhilesh gupta',
            lastMessage: "sab khatam",
            createdAt: "11:30 pm"
        },
        {
            profilePic: pic1,
            name: 'Prince singh',
            lastMessage: "Bye",
            createdAt: "10:24 am"
        },
        {
            profilePic: pic2,
            name: 'Abhinav kushwaha',
            lastMessage: "chalo",
            createdAt: "08:04 pm"
        },
        {
            profilePic: pic3,
            name: 'Vishnu pandey',
            lastMessage: "Kya maharaj",
            createdAt: "11:30 am"
        },
        {
            profilePic: pic4,
            name: 'Akhil kumar',
            lastMessage: "Banega",
            createdAt: "06:40 pm"
        },
        {
            profilePic: pic5,
            name: 'Akhilesh gupta',
            lastMessage: "sab khatam",
            createdAt: "11:30 pm"
        },
    ]

  return (
    <section className='w-80vw max-h-screen overflow-hidden flex gap-1'>
      <section className='w-1/4 overflow-y-scroll border rounded-lg'>
        <div className='w-9/10 h-10 rounded-full border border-slate-500 m-auto mt-4'>
            search bar
        </div>
        <div className=' flex flex-col justify-center py-2'>
            {!convoList.length && 
                <div>
                    // show loading skeleton
                </div>
            }
            {convoList.map((data, index)=>{
                return(
                    <div key={index} className='h-18  my-auto cursor-pointer hover:bg-gray-500'>
                        <div className='h-[1px] w-full bg-slate-400'></div>
                        <div className='flex items-center justify-between px-4 my-2'>
                            <div className='flex items-center gap-2 justify-center'>
                                <img src={data.profilePic} alt='person' className='w-12 h-12 rounded-full bg-red-200 object-cover'/>
                                {/* <i><FaEye/></i> */}
                                <div className=''>
                                    <p className='text-lg font-lg'>{data.name}</p>
                                    <span className='opacity-90'>{data.lastMessage}</span>
                                </div>
                            </div>
                            <div className='opacity-90 font-sm text-xs'>{data.createdAt}</div>
                        </div>
                    </div>        
                )
            })}

            
            
        </div>
      </section>

      <section className='w-3/4'>
            <Message/>
      </section>
    </section>
  )
}

export default Conversations
import React, { useEffect } from 'react'
import { FaHome } from 'react-icons/fa'
import { MdOutlineMessage, MdOutlineSettings } from 'react-icons/md'
import { TbProgress } from "react-icons/tb";
import { CgProfile } from "react-icons/cg";
import { Link, useNavigate } from 'react-router-dom';


const Home = () => {
    const navigate = useNavigate()
    useEffect(()=>{
        navigate('/conversations')
    },[])

    const navArray = [
        {
            icon: <MdOutlineMessage/>,
            title: 'Messages',
            link: '/conversations'
        },
        {
            icon: <TbProgress/>,
            title: 'Status',
            link: '/status'
        },
        {
            icon: <CgProfile/>,
            title: 'My Profile',
            link: '/my-profile'
        },
        {
            icon: <MdOutlineSettings/>,
            title: 'Setting',
            link: '/setting'
        },
    ]
    
  return (
    <section className='w-full'>
        <p className='opactiy-75 text-4xl'>Menu</p>
        <div className='flex items-center justify-around'>
            {
                navArray.map((data, index)=>{
                    return(
                        <Link key={index} to={data.link} className='flex flex-col justify-center items-center w-24 h-18 rounded-lg bg-transparent hover:bg-slate-500 hover:text-white'>
                            <i>{data.icon}</i>
                            <span>{data.title}</span>
                        </Link>
                    )
                })
            }
            
        </div>
    </section>
  )
}

export default Home
import React, { useEffect } from 'react'
import { FaHome } from 'react-icons/fa'
import { MdOutlineMessage, MdOutlineSettings } from 'react-icons/md'
import { TbProgress } from "react-icons/tb";
import { CgProfile } from "react-icons/cg";
import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle'

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
    <section className='w-full min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors'>
      <div className='flex justify-end p-4'>
        <ThemeToggle />
      </div>
      <div className='text-center py-8'>
        <p className='text-4xl font-bold text-gray-900 dark:text-white mb-4'>Menu</p>
        <div className='flex items-center justify-around max-w-2xl mx-auto'>
            {navArray.map((data, index)=>{
                return(
                    <Link key={index} to={data.link} className='flex flex-col justify-center items-center w-24 h-18 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-4 shadow-md dark:shadow-gray-800'>
                        <i className='text-2xl mb-2 text-gray-700 dark:text-gray-300'>{data.icon}</i>
                        <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>{data.title}</span>
                    </Link>
                )
            })}
        </div>
      </div>
    </section>
  )
}

export default Home
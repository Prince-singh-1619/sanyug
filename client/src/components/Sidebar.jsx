import React, { useState } from 'react'
import { IoMdMenu } from 'react-icons/io'
import { MdOutlineMessage, MdOutlineSettings } from 'react-icons/md'
import { TbProgress } from "react-icons/tb";
import { CgProfile } from "react-icons/cg";
import { Link } from 'react-router-dom';
import { MdPersonAddAlt1 } from 'react-icons/md'
import UserSearchPopup from '../popups/UserSearchPopup';
import ThemeToggle from './ThemeToggle';
import { LuPanelRightClose } from "react-icons/lu";
import { LuPanelLeftClose } from "react-icons/lu";
import { AiOutlineClose } from "react-icons/ai";

const Sidebar = () => {
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false)

    // const toggleSidebar = () => {
    //     setIsOpen(!isOpen);
    // };
    const handleOpenPopup = () => {
        setIsPopupOpen(true)
    }
    const handleClosePopup = () => {
        setIsPopupOpen(false)
    }

    const topArray = [
        {
            icon: <IoMdMenu />,
            title: 'Menu',
            link: ''
        },
        {
            icon: <MdOutlineMessage />,
            title: 'Messages',
            link: '/conversations'
        },
        {
            icon: <TbProgress />,
            title: 'Status',
            link: '/status'
        },
    ]

    const downArray = [
        {
            icon: <CgProfile />,
            title: 'My Profile',
            link: '/my-profile'
        },
        {
            icon: <MdOutlineSettings />,
            title: 'Setting',
            link: '/setting'
        },
    ]

    return (
        <>
            {/* ICON SIDEBAR (always visible) */}
            <section className="h-full flex flex-col justify-between items-center rounded-lg bg-transparent py-2">
                <div className="flex flex-col items-center gap-2">
                    <button
                        onClick={() => setIsPanelOpen(true)}
                        title='Menu'
                        className="flex flex-col justify-center items-center w-8 h-8 rounded-lg bg-transparent hover:bg-slate-500 hover:text-white"
                    >
                        {/* <i className="text-2xl"><IoMdMenu /></i> */}
                        <i className="text-2xl"><LuPanelRightClose /></i>
                    </button>

                    <div className="h-[1px] w-full bg-slate-600 my-1"></div>

                    <Link to="/conversations" title='chats' className="flex flex-col justify-center items-center w-8 h-8 rounded-lg bg-transparent hover:bg-slate-500 hover:text-white">
                        <i className="text-2xl"><MdOutlineMessage /></i>
                    </Link>

                    <Link to="/status" title='status' className="flex flex-col justify-center items-center w-8 h-8 rounded-lg bg-transparent hover:bg-slate-500 hover:text-white">
                        <i className="text-2xl"><TbProgress /></i>
                    </Link>
                </div>

                <div className="flex flex-col items-center gap-2">
                    <div title='Dark/Light Mode' className="flex flex-col justify-center items-center w-8 h-8 rounded-lg bg-transparent hover:bg-slate-500 hover:text-white">
                        <ThemeToggle />
                    </div>
                    <button
                        onClick={handleOpenPopup}
                        title='Add to Chat'
                        className="flex flex-col justify-center items-center w-8 h-8 rounded-lg text-2xl bg-green-400 dark:text-black hover:bg-green-500 transition-colors duration-200 cursor-pointer"
                    >
                        <MdPersonAddAlt1 />
                    </button>
                    <div className="h-[1px] w-full bg-slate-600 my-1"></div>
                    <Link to="/my-profile" title='Profile' className="flex flex-col justify-center items-center w-8 h-8 rounded-lg bg-transparent hover:bg-slate-500 hover:text-white">
                        <i className="text-2xl"><CgProfile /></i>
                    </Link>
                    <Link to="/setting" title='Settings' className="flex flex-col justify-center items-center w-8 h-8 rounded-lg bg-transparent hover:bg-slate-500 hover:text-white">
                        <i className="text-2xl"><MdOutlineSettings /></i>
                    </Link>
                </div>

                <UserSearchPopup isOpen={isPopupOpen} onClose={handleClosePopup} />
            </section>

            {/* SLIDE-OUT PANEL */}
            {isPanelOpen && (
                <div className="fixed inset-0 z-50 flex">
                    {/* background overlay (click to close) */}
                    <div
                        className="absolute inset-0 bg-opacity-40"
                        onClick={() => setIsPanelOpen(false)}
                    />

                    {/* sliding panel */}
                    <div className="relative w-64 bg-white dark:bg-[#213547] shadow-xl p-4 h-full animate-slide-in">
                        <button
                            onClick={() => setIsPanelOpen(false)}
                            className="absolute top-3 right-3 text-xl">
                            <i><AiOutlineClose/></i>
                        </button>
                        <nav className='h-full mt-2 flex flex-col justify-between  rounded-lg bg-transparent py-2'>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-3 rounded">
                                    {/* <LuPanelLeftClose className="text-xl mt-1" /> */}
                                    <span className='text-4xl font-semibold'>Sanyug</span>
                                </div>
                                <div className='h-[1px] w-full bg-slate-600 my-1'></div>
                                <Link to="/status" className="active-link-text flex items-center gap-3 hover:bg-[#E2E8F0] p-2 rounded">
                                    <MdOutlineMessage className="text-xl" />
                                    <span>Messages</span>
                                </Link>
                                <Link to="/progress" className="active-link-text flex items-center gap-3 hover:bg-[#E2E8F0] p-2 rounded">
                                    <TbProgress className="text-xl" />
                                    <span>Status</span>
                                </Link> 
                            </div>
                            <div className="flex flex-col  gap-2">
                                <button onClick={handleOpenPopup} className='text-[#1a1a1a] flex items-center gap-3 p-2 rounded bg-green-400 hover:bg-green-500 transition-colors duration-200 cursor-pointer' > 
                                    <i><MdPersonAddAlt1/></i>
                                     <span>Add to Chat</span>
                                </button>
                                <div className='h-[1px] w-full bg-slate-600 my-1'></div>
                                <Link to="/my-profile" className="active-link-text flex items-center gap-3 hover:bg-[#E2E8F0] p-2 rounded">
                                    <CgProfile className="text-xl" />
                                    <span>My Profile</span>
                                </Link>
                                <Link to="/setting" className="active-link-text flex items-center gap-3 hover:bg-[#E2E8F0] p-2 rounded">
                                    <MdOutlineSettings className="text-xl" />
                                    <span>Settings</span>
                                </Link>
                            </div>
                        </nav>
                    </div>
                </div>
            )}
        </>


// <section className='h-full flex flex-col justify-between items-center rounded-lg bg-transparent py-2'>
    //     <div className='flex flex-col items-center gap-2'>
    //         <Link to='' className='flex flex-col justify-center items-center w-8 h-8 rounded-lg bg-transparent hover:bg-slate-500 hover:text-white'>
    //             <i className='text-2xl'><IoMdMenu/></i>
    //             {/* <span>Sanyug</span> */}
    //         </Link>
    //         <div className='h-[1px] w-full bg-slate-600 my-1'></div>
    //         <Link to='/status' className='flex flex-col justify-center items-center w-8 h-8 rounded-lg bg-transparent hover:bg-slate-500 hover:text-white'>
    //             <i className='text-2xl'><MdOutlineMessage/></i>
    //             {/* <span>Status</span> */}
    //         </Link>
    //         <Link to='/status' className='flex flex-col justify-center items-center w-8 h-8 rounded-lg bg-transparent hover:bg-slate-500 hover:text-white'>
    //             <i className='text-2xl'><TbProgress/></i>
    //             {/* <span>Status</span> */}
    //         </Link>
    //     </div>

    //     <div className='flex flex-col items-center gap-2'>
    //         <div className='flex flex-col justify-center items-center w-8 h-8 rounded-lg bg-transparent hover:bg-slate-500 hover:text-white'>
    //             <ThemeToggle/>
    //         </div>
    //         <button onClick={handleOpenPopup} className='flex flex-col justify-center items-center w-8 h-8 rounded-lg text-2xl bg-green-400 dark:text-black hover:bg-green-500 transition-colors duration-200 cursor-pointer' > 
    //             <MdPersonAddAlt1/> 
    //         </button>
    //         <div className='h-[1px] w-full bg-slate-600 my-1'></div>
    //         <Link to='/my-profile' className='flex flex-col justify-center items-center w-8 h-8 rounded-lg bg-transparent hover:bg-slate-500 hover:text-white'>
    //             <i className='text-2xl'><CgProfile/></i>
    //             {/* <span>My Profile</span> */}
    //         </Link>
    //         <Link to='/setting' className='flex flex-col justify-center items-center w-8 h-8 rounded-lg bg-transparent hover:bg-slate-500 hover:text-white'>
    //             <i className='text-2xl'><MdOutlineSettings/></i>
    //             {/* <span>Menu</span> */}
    //         </Link>
    //     </div>
        
    //     <UserSearchPopup isOpen={isPopupOpen} onClose={handleClosePopup} />
    // </section>
    )
}

export default Sidebar
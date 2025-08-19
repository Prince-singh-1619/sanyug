import React, { useState } from 'react'
import { IoMdMenu } from 'react-icons/io'
import { MdPersonAddAlt1 } from 'react-icons/md'
import ThemeToggle from './ThemeToggle'
import UserSearchPopup from './UserSearchPopup'

const Header = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  const handleOpenPopup = () => {
    setIsPopupOpen(true)
  }

  const handleClosePopup = () => {
    setIsPopupOpen(false)
  }

  return (
    <>
      <div className='w-full h-16  mb-1 rounded-lg flex justify-between items-center'>
        <div className='flex gap-4 items-center justify-center'>
          <i className='text-4xl'><IoMdMenu/></i>
          <div className='flex flex-col items-center'>
            <p className='text-4xl font-xl'>Sanyug</p>
            <span className='opacity-90 text-sm'>Coming together</span>
          </div>
        </div>

        <div className='flex gap-4 items-center mr-4'>
          <ThemeToggle/>
          <button 
            onClick={handleOpenPopup}
            className='text-4xl h-14 w-14 rounded-full flex justify-center items-center bg-green-400 right-2 bottom-2 dark:text-black hover:bg-green-500 transition-colors duration-200 cursor-pointer'
          > 
            <MdPersonAddAlt1/> 
          </button>
        </div>
      </div>

      <UserSearchPopup isOpen={isPopupOpen} onClose={handleClosePopup} />
    </>
  )
}

export default Header
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { disconnectSocket, getSocket } from '../socket/socket'
import { useDispatch, useSelector } from "react-redux";
import { clearChatState } from '../redux/slices/chatSlice'
import { clearConvoState } from '../redux/slices/convoSlice';
import dummyDp from '../assets/person-dummy.svg'
import { FaCamera, FaEdit, FaSave, FaTimes, FaSignOutAlt, FaLock } from "react-icons/fa";
import ThemeToggle from '../components/ThemeToggle';
import { MdClose, MdDelete, MdOutlineEdit, MdVerifiedUser } from 'react-icons/md';
import ImageToBase64 from '../helpers/ImageToBase64';
import SummaryApi from '../helpers/SummaryApi';
import { clearUserData, setUserData } from '../redux/slices/userSlice';
import Sidebar from '../components/Sidebar';
import ImagePopup from '../popups/ImagePopup';

const MyProfile = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const socket = getSocket()

    const { authToken, userData } = useSelector(state => state.user)
    const userId = userData?._id;

    const [user, setUser] = useState(userData)
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isImagePopup, setIsImagePopup] = useState(false);

    const handleChange = (e) => {
      setUser({ ...user, [e.target.name]: e.target.value });
    };

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, "0");
      const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      return `${day} ${month} ${year}`;
    };

    const uploadToCloudinary = async(media) =>{
      if(!media) return
      
      try {
        const formData = new FormData()
        formData.append("file", media)
    
        const res = await fetch(SummaryApi.sendMedia.url, {
          method:SummaryApi.sendMedia.method,
          headers: {
            Authorization: `Bearer ${authToken}`
          },
          body: formData
        })
    
        const resData = await res.json();
        console.log("File uploaded", resData)
        return resData
      } 
      catch (error) {
        toast.error("Error uploading highRes DP")
        console.log(error)
      }
    }

    const handleUploadPic = async (e) => {
      const file = e.target.files[0]
      if(!file) return ;

      const lowResPic  = await ImageToBase64(file, {maxSizeMB:0.05, maxWidthOrHeight:200, initialQuality: 0.1})

      setUser((prev) => {
        return {
          ...prev,
          profilePic:{
            ...prev.profilePic,
            file,
            lowResPic,
          }
        }
      })
      console.log("new user pic updated locally: ", user)
    }
    const removeProfilePic = (e)=>{
      e.preventDefault()
      setUser((prev) =>{
        return{
          ...prev, 
          profilePic:{
            ...prev.profilePic,
            file: null,
            lowResPic:"",
            highResPic: ""
          }
        }
      })
    }

    const handleLogout = () =>{
      if(socket){
        socket.emit("user_logout", {userId});
        disconnectSocket();
        dispatch(clearChatState());
        dispatch(clearConvoState());
      }
      localStorage.removeItem("authToken")
      dispatch(clearUserData());
      toast.success("Logged out successfully")
      navigate('/login')
    }

    const handleSubmit = async(e) =>{
      e.preventDefault();
      setLoading(true)

      const updatedFields = {}
      for(let key in user){
        if(key !== "profilePic" && user[key] !== userData[key]){
          updatedFields[key] = user[key]
        }
      }
      // If user selected a new profilePic file -> upload now
      if (user.profilePic?.file) {
        try {
          const highResPicData = await uploadToCloudinary(user.profilePic.file);
          updatedFields["profilePic"] = {
            highResPic: highResPicData.url,
            highResPicPublicId: highResPicData.publicId,
            lowResPic: user.profilePic.lowResPic,
          };
        } catch (err) {
          console.error("Cloudinary upload failed:", err);
          toast.error("Failed to upload profile picture");
          setLoading(false);
          return;
        }
      } else {
        // Only update if lowResPic changed
        if (user.profilePic?.lowResPic !== userData.profilePic?.lowResPic) {
          updatedFields["profilePic"] = {
            ...(updatedFields["profilePic"] || {}),
            lowResPic: user.profilePic.lowResPic,
          };
        }
      }

      if(Object.keys(updatedFields).length===0){
        toast.warning("No changes made")
        setLoading(false)
        return;
      }

      try {
        const response = await fetch(SummaryApi.updateProfile.url, {
          method: SummaryApi.updateProfile.method,
          headers: {
            'Content-Type': 'application/json',
            "Authorization" : `Bearer ${authToken}`,
          },
          body: JSON.stringify({...updatedFields, userId}),
        })  

        const dataApi = await response.json()
        if(dataApi.success){
          dispatch(setUserData({ userData:dataApi.data }))
          toast.success(dataApi.message)
        }
        if(dataApi.error){
          toast.error(dataApi.message)
          console.log(dataApi.error)
        }
      } 
      catch (error) {
        console.log("error occured in EditProfile", error)
        toast.warning("Error updating profile")
      }
      setLoading(false)
      setIsEditing(false);
    }

    return (
    <section className="h-[99vh] flex ">
      <div className='max-[425px]:hidden'> <Sidebar/> </div>

      <div className="relative h-fit min-w-1/2 max-w[90%] flex flex-col items-center p-8 mt-8 max-w-2xl mx-auto bg-slate-300 dark:bg-[#151515] shadow-xl rounded-lg">
        {/* Profile Picture */}
        <div className="relative group">
          <img src={ (isEditing ? user.profilePic?.lowResPic : userData.profilePic?.lowResPic) || dummyDp} alt="Profile" onClick={()=>!isEditing && setIsImagePopup(true)} className={`w-32 h-32 mx-auto rounded-xl border-4 border-slate-500 shadow-lg object-cover lazy-loading ${!isEditing && user.profilePic?.highResPic ? 'cursor-pointer':''} `} />
          {isEditing && (
            <div>
              <input id='upload-pic' type='file' name='profilePic' accept="image/*" className='hidden' onChange={handleUploadPic}/>
              <label htmlFor='upload-pic' className='absolute w-full bg-opacity-80 text-center bottom-0 cursor-pointer'>
                  <div className='absolute right-2 bottom-2 cursor-pointer bg-slate-200 dark:bg-[#1a1a1a] rounded-md p-1 border-[1px]'>
                    { user.profilePic?.lowResPic==="" ? (
                      <span className='text-green-700 dark:text-green-400'><MdOutlineEdit/></span> 
                    ) : (
                      <span onClick={removeProfilePic} className='text-red-600 dark:text-red-400'><MdDelete/></span>
                    )}
                  </div>
              </label>
            </div>
          )}
          {!isEditing && (
            <button title='verified' className={` ${!user.isVerified ? 'hidden':'absolute'} bottom-1 right-1 bg-slate-300 dark:bg-[#1a1a1a] p-1 rounded-full shadow-md`}>
              <MdVerifiedUser className='text-2xl text-green-700 dark:text-green-500'/>
            </button>
          )}

          <ImagePopup url={user?.profilePic?.highResPic} lowRes={user?.profilePic?.lowResPic} isOpen={isImagePopup} onClose={()=>setIsImagePopup(false)}/>
        </div>

        {/* User Info */}
        <div className="mt-6 w-full">
          {isEditing ? (
            <div className="w-full flex flex-col justify-center items-center gap-4">
              <div className='w-full flex max-[425px]:flex-col gap-4'>
                <input type="text" name="firstName" value={user.firstName} onChange={handleChange} className="border p-3 rounded-lg w-full" placeholder="firstName" />
                <input type="text" name="lastName" value={user.lastName} onChange={handleChange} className="border p-3 rounded-lg w-full" placeholder="lastName"/>
              </div>
              <div className='w-full flex max-[425px]:flex-col gap-4'>
                <input type="text" name="username" value={user.username} onChange={handleChange} className="border p-3 rounded-lg w-full break-words" placeholder="Username" />
                <span className="border p-3 rounded-lg cursor-not-allowed opacity-75 w-full min-[425px]:max-w-[48.5%] break-words">{user.email}</span>
              </div>
              {/* <select name="gender" value={user.gender} onChange={handleChange} className="border p-3 rounded-lg">
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select> */}
              {/* <input type="date" name="birthday" value={user.birthday} onChange={handleChange} className="border p-3 rounded-lg"/> */}
              <textarea name="status" value={user.status} onChange={handleChange} className="border p-3 rounded-lg w-full col-span-2 " placeholder="Status"/>
            </div>
          ) : (
            <div className="mx-auto flex flex-col flex-wrap gap-2 ">
              <h1 className="text-4xl max-[425px]:text-3xl font-bold text-center text-nowrap capitalize">{user.firstName} {user.lastName}</h1>

              <div className='w-full flex max-[425px]:flex-col max-[425px]:items-start items-center justify-start gap-2'>
                  <span className='opacity-85'>Username:</span>
                  <p className="text-2xl max-[425px]:text-xl font-semibold break-all">{userData.username}</p>
              </div>
              <div className='w-full flex max-[425px]:flex-col max-[425px]:items-start items-center justify-start gap-2'>
                  <span className='opacity-85'>Email:</span>
                  <p className="text-xl max-[425px]:text-lg font-semibold break-all">{userData.email}</p>
              </div>
              <div className='w-full flex max-[425px]:flex-col max-[425px]:items-start items-center justify-start gap-2'>
                  <span className='opacity-85'>Status:</span>
                  <p className="text-lg max-[425px]:text-md font-semibold break-all">{userData.status}</p>
              </div>
              <div className='flex items-center justify-start gap-2'>
                  <span className='opacity-85'>Using since:</span>
                  <p className="text-lg max-[425px]:text-md font-semibold">{formatDate(userData.createdAt)}</p>
              </div>

            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="mt-6 flex flex-wrap gap-4 justify-center">
          {isEditing ? (
            <>
              <button onClick={handleSubmit} className="flex items-center gap-2 bg-green-400 dark:bg-green-600 px-5 py-2 rounded-lg shadow-md " >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <span className='flex gap-2 items-center'> <FaSave/> Save </span>
                )}
              </button>
              <button onClick={() => setIsEditing(false)} className="flex items-center gap-2 bg-gray-400 dark:bg-gray-700 px-5 py-2 rounded-lg shadow-md ">
                <FaTimes /> Cancel
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setIsEditing(true)} className="h-10 flex items-center gap-2 bg-blue-400 dark:bg-blue-700 px-5 py-2 rounded-lg shadow-md " >
                <FaEdit /> Edit Profile
              </button>
              <button onClick={handleLogout} className="h-10 flex items-center gap-2 bg-red-400 dark:bg-red-600 px-5 py-2 rounded-lg shadow-md " >
                <FaSignOutAlt /> Logout
              </button>
            </>
          )}
        </div>

        {/* <div className="absolute top-2 left-2"> <ThemeToggle/> </div>  */}
        <div onClick={()=>navigate(-1)} className="absolute top-2 right-2 text-xl cursor-pointer"> <MdClose/> </div> 
      </div>
    </section>
    )
}

export default MyProfile
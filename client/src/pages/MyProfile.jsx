import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { disconnectSocket, getSocket } from '../socket/socket'
import { useDispatch } from "react-redux";
import { clearChatState } from '../redux/slices/chatSlice'
import { clearConvoState } from '../redux/slices/convoSlice';
import dummyDp from '../assets/person-dummy.svg'
import { FaCamera, FaEdit, FaSave, FaTimes, FaSignOutAlt, FaLock } from "react-icons/fa";
import ThemeToggle from '../components/ThemeToggle';

const MyProfile = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const socket = getSocket()

    const userData = JSON.parse(localStorage.getItem("userData"));
    const userId = userData?.userId;

    const [user, setUser] = useState(userData)
    const [isEditing, setIsEditing] = useState(false);
    // const [user, setFormData] = useState(user);

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const formatTimestamp = (dateString) =>{
        if (!dateString) return "";

        const date = new Date(dateString);
        const now = new Date();

        // Helper to zero out time for date comparison
        const stripTime = d => new Date(d.getFullYear(), d.getMonth(), d.getDate());

        const today = stripTime(now);
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const messageDate = stripTime(date);

        if (messageDate.getTime() === today.getTime()) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (messageDate.getTime() === yesterday.getTime()) {
            return 'Yesterday';
        } else {
            // Older -> show date
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }
    }

    const handleSave = () => {
        // setUser(user);
        setIsEditing(false);
        // You’d also send updated data to backend here
    };

    const handleLogout = () =>{
        if(socket){
            socket.emit("user_logout", {userId});
            disconnectSocket();
            dispatch(clearChatState());
            dispatch(clearConvoState());
        }
        localStorage.removeItem("userData")
        localStorage.removeItem("authToken")
        toast.success("Logged out successfully")
        navigate('/login')
    }

    console.log("userData", userData)

    return (
    <div className="flex flex-col items-center p-8 mt-8 max-w-2xl mx-auto bg-gradient-to-b bg-slate-300 dark:bg-[#151515] shadow-xl rounded-2xl">
      {/* <ThemeToggle className="absolute"/> */}
      {/* Profile Picture */}
      <div className="relative group">
        <img
          src={user.profilePic || dummyDp}
          alt="Profile"
          className="w-32 h-32 rounded-full border-4 border-slate-500 shadow-lg object-cover"
        />
        {isEditing && (
          <input
            type="text"
            name="profilePic"
            placeholder="Profile Pic URL"
            value={user.profilePic}
            onChange={handleChange}
            className="mt-3 border rounded p-2 w-64"
          />
        )}
        {/* {!isEditing && (
          <button className="absolute bottom-2 right-2 bg-blue-500 text-white p-2 rounded-full shadow-md hover:bg-blue-600">
            <FaCamera />
          </button>
        )} */}
      </div>

      {/* User Info */}
      <div className="mt-6 w-full">
        {isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="username"
              value={user.username}
              onChange={handleChange}
              className="border p-3 rounded-lg"
              placeholder="Username"
            />
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              className="border p-3 rounded-lg"
              placeholder="Email"
            />
            <input
              type="text"
              name="phone"
              value={user.phone}
              onChange={handleChange}
              className="border p-3 rounded-lg"
              placeholder="Phone"
            />
            <input
              type="text"
              name="location"
              value={user.location}
              onChange={handleChange}
              className="border p-3 rounded-lg"
              placeholder="Location"
            />
            <select
              name="gender"
              value={user.gender}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
            <input
              type="date"
              name="birthday"
              value={user.birthday}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />
            <textarea
              name="status"
              value={user.status}
              onChange={handleChange}
              className="border p-3 rounded-lg col-span-2"
              placeholder="Status"
            />
          </div>
        ) : (
          <div className="w-1/2 mx-auto text-center space-y-2 ">
            <h1 className="text-4xl font-bold capitalize">{user.firstName} {user.lastName}</h1>

            <div className='flex items-center justify-start gap-2'>
                <span className='opacity-85'>Username:</span>
                <p className="text-2xl font-semibold">{user.username}</p>
            </div>
            <div className='flex items-center justify-start gap-2'>
                <span className='opacity-85'>Email:</span>
                <p className="text-xl font-semibold">{user.email}</p>
            </div>
            <div className='flex items-center justify-start gap-2'>
                <span className='opacity-85'>Status:</span>
                <p className="text-lg font-semibold">{user.status}</p>
            </div>
            <div className='flex items-center justify-start gap-2'>
                <span className='opacity-85'>Last Seen at:</span>
                <p className="text-lg font-semibold">{formatTimestamp(user.lastSeen)}</p>
            </div>
            <div className='flex items-center justify-start gap-2'>
                <span className='opacity-85'>Using since:</span>
                <p className="text-lg font-semibold">{formatTimestamp(user.createdAt)}</p>
            </div>

          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-green-500 text-white px-5 py-2 rounded-lg shadow-md hover:bg-green-600"
            >
              <FaSave /> Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-2 bg-gray-400 text-white px-5 py-2 rounded-lg shadow-md hover:bg-gray-500"
            >
              <FaTimes /> Cancel
            </button>
          </>
        ) : (
          <>
            {/* <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-blue-400 dark:bg-blue-700 px-5 py-2 rounded-lg shadow-md "
            >
              <FaEdit /> Edit Profile
            </button>
            <button
              onClick={() => alert("Change password flow")}
              className="flex items-center gap-2 bg-yellow-400 dark:bg-yellow-600 px-5 py-2 rounded-lg shadow-md "
            >
              <FaLock /> Change Password
            </button> */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-400 dark:bg-red-600 px-5 py-2 rounded-lg shadow-md "
            >
              <FaSignOutAlt /> Logout
            </button>
          </>
        )}
      </div>
    </div>


    //     <div className="flex flex-col items-center p-6 max-w-lg mx-auto">
    //   {/* Profile Picture */}
    //   <div className="relative">
    //     <img
    //       src={user.profilePic || dummyDp}
    //       alt="Profile"
    //       className="w-32 h-32 rounded-full border-4 border-blue-500 shadow-md"
    //     />
    //     {isEditing && (
    //       <input
    //         type="text"
    //         name="profilePic"
    //         placeholder="Profile Pic URL"
    //         value={user.profilePic}
    //         onChange={handleChange}
    //         className="mt-2 w-full border rounded p-2"
    //       />
    //     )}
    //   </div>

    //   {/* User Info */}
    //   <div className="mt-6 text-center w-full">
    //     {isEditing ? (
    //       <div className="flex flex-col gap-3">
    //         <input
    //           type="text"
    //           name="username"
    //           value={user.username}
    //           onChange={handleChange}
    //           className="border p-2 rounded w-full"
    //           placeholder="Username"
    //         />
    //         <input
    //           type="email"
    //           name="email"
    //           value={user.email}
    //           onChange={handleChange}
    //           className="border p-2 rounded w-full"
    //           placeholder="Email"
    //         />
    //         <input
    //           type="text"
    //           name="phone"
    //           value={user.phone}
    //           onChange={handleChange}
    //           className="border p-2 rounded w-full"
    //           placeholder="Phone"
    //         />
    //         <textarea
    //           name="status"
    //           value={user.status}
    //           onChange={handleChange}
    //           className="border p-2 rounded w-full"
    //           placeholder="Status"
    //         />
    //       </div>
    //     ) : (
    //       <div>
    //         <h2 className="text-2xl font-bold">{user.username}</h2>
    //         <p className="text-gray-600">{user.email}</p>
    //         <p className="text-gray-600">{user.phone}</p>
    //         <p className="mt-2 italic text-gray-800">"{user.status}"</p>
    //       </div>
    //     )}
    //   </div>

    //   {/* Buttons */}
    //   <div className="mt-6 flex gap-4">
    //     {isEditing ? (
    //       <>
    //         <button
    //           onClick={handleSave}
    //           className="bg-green-500 text-white px-4 py-2 rounded-lg"
    //         >
    //           Save
    //         </button>
    //         <button
    //           onClick={() => setIsEditing(false)}
    //           className="bg-gray-400 text-white px-4 py-2 rounded-lg"
    //         >
    //           Cancel
    //         </button>
    //       </>
    //     ) : (
    //       <>
    //         <button
    //           onClick={() => setIsEditing(true)}
    //           className="bg-blue-500 text-white px-4 py-2 rounded-lg"
    //         >
    //           Edit Profile
    //         </button>
    //         <button
    //           onClick={() => alert("Change password flow")}
    //           className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
    //         >
    //           Change Password
    //         </button>
    //         <button
    //           onClick={() => alert("Logout flow")}
    //           className="bg-red-500 text-white px-4 py-2 rounded-lg"
    //         >
    //           Logout
    //         </button>
    //       </>
    //     )}
    //   </div>
        
    //     <div onClick={handleLogout} className='w-24 h-18 flex justify-center items-center rounded-lg bg-transparent hover:bg-slate-500 hover:text-white cursor-pointer '>Logout</div>

    // </div>
    )
}

export default MyProfile
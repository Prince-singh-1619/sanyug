import React, { useState } from 'react'
import SummaryApi from '../helpers/SummaryApi';
// import { toast } from 'react-toastify';
import { deleteMessage } from '../redux/slices/chatSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { connectSocket, getSocket } from '../socket/socket';

// connectSocket()

const DeleteConfirm = ({msgId, open, setOpen}) => {
    // console.log("msgId frontend: ", msgId)
    // const [open, setOpen] = useState(false);
    const dispatch = useDispatch()
    // const [deleteBox, setDeleteBox] = useState(false);
    const {activeConvoId, convoList} = useSelector((state)=>state.convo)

    // const authToken = localStorage.getItem("authToken");
    // const userData = JSON.parse(localStorage.getItem("userData"))
    const { authToken, userData } = useSelector(state => state.user)
    const userId = userData?._id

    // const socket = connectSocket()
    const socket = getSocket();

    const receivers = convoList.find(c=>c.convoId===activeConvoId).participants.filter(p => p._id !== userId).map(p=>p._id) || [];
    console.log("getParticipants", receivers)

    const handleDelete = async() =>{
      if (!msgId || msgId.toString().startsWith("temp")) {
        console.warn("Cannot delete a pending message yet");
        return;
      }
      console.log("deleting...", msgId)
      // setIsDeleting(true)
      try {
        const res = await toast.promise(
          fetch(SummaryApi.deleteMessage.url, {
          method: SummaryApi.deleteMessage.method,
          headers: { 
          "Content-Type": "application/json",
          'Authorization': `Bearer ${authToken}`,
          },
          body: JSON.stringify({ msgId }),
        }), 
          {
            loading: "Deleting...",
            success: "Message deleted",
            error: "Failed to delete message"
          }
        );
        const resData = await res.json();
        if (resData.success) {
          // toast.success(resData.message)
          console.log(resData.message);
          // No need to update UI here, socket will handle it
          dispatch(deleteMessage({msgId, convoId:activeConvoId}))
          socket.emit("message-deleted", ({msgId, convoId:activeConvoId, receivers}))
          setOpen(false);
        }
      } catch (error) {
        console.error("Error deleting message", error)
      }
    }
    // useEffect(() => {
    //   // socket.on("messageDeleted", (data) => {
    //     // dispatch(deleteMessage({msgId:data.msgId, updatedText:data.updatedText || "This message has been deleted"}))
    //     // setMessageList((prev) =>
    //     //   prev.map((msg) =>
    //     //     msg._id === data.msgId ? { ...msg, text: data.updatedText } : msg
    //     //   )
    //     // );
    //   });

    //   return () => socket.off("messageDeleted");
    // }, []);

  const handleCancel = () => setOpen(false);

  return (
    <section>
      {open && (
        <div onClick={handleCancel} className="fixed inset-0 backdrop-blur-[1px] flex items-center justify-center z-50">
          <div onClick={(e) => e.stopPropagation()} className="bg-opacity-10 backdrop-blur-none bg-slate-300 dark:bg-[#151515] border p-6 rounded-2xl w-fit">
            <h2 className="text-lg font-semibold text-red-600 dark:text-red-500">Delete Message?</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 flex flex-col">
                <span>Are you sure you want to delete this message?</span>
                <span>This action cannot be undone.</span>
            </p>
            <div className="flex justify-end gap-3 mt-5">
              <button onClick={handleCancel} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-700"> Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"> Delete </button>
            </div>
          </div>
        </div>
      )} 
    </section>
  );
}

export default DeleteConfirm
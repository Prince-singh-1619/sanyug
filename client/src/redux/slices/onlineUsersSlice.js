import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  onlineUsers: [],
};

const onlineUsersSlice = createSlice({
    name: "onlineUsers",
    initialState,
    reducers: {
        setOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload
        },
        addOnlineUser: (state, action) => {
            const userId = action.payload
            if (!state.onlineUsers.includes(userId)) {
                state.onlineUsers.push(userId)
            }
        },
        removeOnlineUser: (state, action) => {
            const userId = action.payload
            state.onlineUsers = state.onlineUsers.filter(id => id !== userId)
        },
    },
});

export const {
    setOnlineUsers,
    addOnlineUser, 
    removeOnlineUser,
} = onlineUsersSlice.actions

export default onlineUsersSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    authToken: null,
    userData: {},
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers:{
        setAuthToken: (state, action) =>{
            const { authToken } = action.payload
            state.authToken = authToken
            console.log("setAuthToken", authToken)
        },
        setUserData: (state, action) =>{
            const { userData } = action.payload
            state.userData = userData
            console.log("setUserData", userData)
        },
        clearUserData: (state) =>{
            state.authToken = null;
            state.userData = {};
        },
    }
})

export const {
    setAuthToken,
    setUserData,
    clearUserData,
} = userSlice.actions;

export default userSlice.reducer
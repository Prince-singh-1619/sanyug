import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    isSound: true,
    isDefaultBg: true,
    chatBgWallpaper: null,
    leftPanelWidth: null,
}

const settingSlice = createSlice({
    name: "settings",
    initialState,
    reducers:{
        setIsSound: (state) =>{
            state.isSound = !state.isSound;
        },
        setIsDefaultBg: (state, action) =>{
            state.isDefaultBg = action.payload;
        },
        setChatBgWallpaper: (state, action) =>{
            const { bgWp } = action.payload;
            state.chatBgWallpaper = bgWp
        },
        setLeftPanelWidth: (state, action) =>{
            const { newWidth } = action.payload
            state.leftPanelWidth = newWidth
        },
    },
});

export const {
    setIsSound, 
    setIsDefaultBg,
    setChatBgWallpaper, 
    setLeftPanelWidth,
} = settingSlice.actions;

export default settingSlice.reducer
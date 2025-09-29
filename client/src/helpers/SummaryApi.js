// const backendDomain = 'http://localhost:8080'
const backendDomain = 'https://sanyug-server.onrender.com'

const SummaryApi = {
    sendOtp:{
        url:`${backendDomain}/api/send-otp`,
        method: "POST"
    },
    verifyOtp:{
        url:`${backendDomain}/api/verify-otp`,
        method: "POST"
    },
    signUp:{
        url:`${backendDomain}/api/register`,
        method: "POST"
    },
    login:{
        url:`${backendDomain}/api/login`,
        method: "POST"
    },
    googleAuth:{
        url:`${backendDomain}/api/auth/google`,
        method: "POST"
    },
    updateProfile:{
        url:`${backendDomain}/api/edit-profile`,
        method: "PUT"
    },
    searchUser:{
        url:`${backendDomain}/api/search-user`,
        method: "GET"
    },
    addUserToChat:{
        url:`${backendDomain}/api/conversations/add-user-to-chat`,
        method: "POST"
    },
    fetchConvos:{
        url:`${backendDomain}/api/fetch-convo`,
        method: "GET"
    },
    sendMessage:{
        url:`${backendDomain}/api/store-message`,
        method: "POST"
    },
    sendMedia:{
        url:`${backendDomain}/api/store-media`,
        method: "POST"
    },
    fetchMessage:{
        url:`${backendDomain}/api/fetch-message`,
        method: "GET"
    },
    deleteMessage:{
        url:`${backendDomain}/api/remove-message`,
        method: "PUT"
    },
    

}

export default SummaryApi
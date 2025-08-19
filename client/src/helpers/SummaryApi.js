const backendDomain = 'http://localhost:8080'

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
    fetchMessage:{
        url:`${backendDomain}/api/fetch-message`,
        method: "GET"
    },
    

}

export default SummaryApi
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
}

export default SummaryApi
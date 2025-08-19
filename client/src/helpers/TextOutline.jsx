import React from 'react'

const TextOutline = ({text, sender}) => {
    // const text = 'hi, hello, how you there? what you gonna do now?    hi, hello, how you there? what you gonna do now?       hi, hello, how you there? what you gonna do now?  hi, hello, how you there? what you gonna do now?  hi, hello, how you there? what you gonna do now?'
    const userData = JSON.parse(localStorage.getItem("userData"))
    const userId = userData?.userId
    // const sender=userId
    const me = sender===userId ? true : false
    // const me = true
//   const me = false

    return (
        <div className={` rounded-lg ${me ? 'rounded-br-none':'rounded-bl-none'} `}>
        </div>
    )
}

export default TextOutline
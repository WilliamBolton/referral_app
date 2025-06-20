import React from 'react'

export default function Message({text, sent}) {
    // Bubble to contain a message
    return (
        <div className={`message ${sent ? 'sent':'recieved'}`}>
            <div className='message-bubble'>{text}</div>
        </div>
    )
}
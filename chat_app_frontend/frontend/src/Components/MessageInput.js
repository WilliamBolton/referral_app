import React, { useState } from 'react';

export default function MessageInput({ handleSendMessage, handleInputChange, inputValue}) {
    // Area to input a text message
    return (
        <div className='message-input'>
            <textarea
                placeholder='What is your message?'
                value={inputValue}
                onChange={handleInputChange}
            />
            <button onClick={handleSendMessage}>Send</button>
        </div>
    );
}

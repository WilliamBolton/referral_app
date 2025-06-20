import React from 'react';
import ChatSidebar from './ChatSidebar';
import AIChatArea from './AIChatArea';

const AIChatContainer = () => {
  // Combines ChatSidebar and AIChatArea into one view 
  return (
    <div className='chat-container'>
      <ChatSidebar />
      <AIChatArea />
    </div>
  );
}

export default AIChatContainer;
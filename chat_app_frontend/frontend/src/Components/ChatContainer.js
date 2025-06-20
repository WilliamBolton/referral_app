import React from 'react';
import ChatSidebar from './ChatSidebar';
import ChatArea from './ChatArea';

const ChatContainer = () => {
  // Combines ChatSidebar and ChatArea into one view 
  return (
    <div className='chat-container'>
      <ChatSidebar />
      <ChatArea />
    </div>
  );
}

export default ChatContainer;
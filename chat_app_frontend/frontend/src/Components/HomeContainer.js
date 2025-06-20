import React from 'react';
import ChatSidebar from './ChatSidebar';
import HomeArea from './HomeArea';

const HomeContainer = () => {
  // Combines ChatSidebar and HomeArea into one view 
  return (
    <div className='home-container'>
      <ChatSidebar />
      <HomeArea />
    </div>
  );
}

export default HomeContainer;
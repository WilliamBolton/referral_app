import React from 'react';
import ChatSidebar from './ChatSidebar';
import Referral from './Referral';

const ReferralContainer = () => {
  // Combines ChatSidebar and Referral area into one view 
  return (
    <div className='referral-container'>
      <ChatSidebar />
      <Referral />
    </div>
  );
}

export default ReferralContainer;
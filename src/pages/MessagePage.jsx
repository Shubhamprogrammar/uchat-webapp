import React from 'react';
import ContactList from '../components/ContactList';
import Profile from '../components/Profile';

const MessagePage = () => {
  return (
    <div className='grid grid-cols-3 gap-10 p-2'>
      <ContactList/>
      <div>Message</div>
      <Profile/>
    </div>
  )
}

export default MessagePage

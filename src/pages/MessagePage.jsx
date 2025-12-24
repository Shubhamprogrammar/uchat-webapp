import React from 'react'

const MessagePage = () => {
  return (
    <div className='flex flex-row justify-around'>
     
      <div>
         
         <input type='text' placeholder='search...' className='border border-gray rounded  w-full'/>
        </div>
      <div>Message</div>
      <div>Logout</div>
    </div>
  )
}

export default MessagePage

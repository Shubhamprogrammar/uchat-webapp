import React from 'react';
import { FaComments, FaEllipsisV, FaSearch } from 'react-icons/fa';

const ContactList = () => {
  return (
    <section>
      <div className='flex justify-between'>
      <div className='flex flex-row gap-2 mb-4 p-3'>
        <FaComments className="text-2xl text-blue-800" />
        <h1 className='text-2xl font-bold  text-amber-500 '>U<span className='text-2xl font-bold text-blue-800'>chat</span></h1>
      </div>
      <div>
      <FaEllipsisV className="text-xl text-gray-700 absolute top-4 cursor-pointer" />
      </div>
      </div>
      {/* <h2 className='text-xl font-semibold text-gray-700 ml-2  right-0'>Contacts</h2> */}
        <div className='flex gap-2'>
      
      
      <input type="text" placeholder="Search...." className='p-2 w-full border border-gray-500 font-medium ml-2 rounded-full' />
      
      </div>
      {
        /* Contact Items - Example */
        [1, 2, 3, 4, 5].map((contact) => (
          <div key={contact} className="flex items-center p-3 border-b border-gray-300 hover:bg-gray-100 cursor-pointer">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {`U${contact}`}
            </div>
            <div className="ml-4">
              <p className="text-gray-800 font-medium">User {contact}</p>
              <p className="text-gray-500 text-sm">Last message preview...</p>
            </div>
          </div>
        ))
      }
      
    </section>
  )
}

export default ContactList

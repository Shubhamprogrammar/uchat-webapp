import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaComments, FaEllipsisV, FaSearch } from 'react-icons/fa';

const ContactList = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const fetchUsers = async (query = "") => {
    try {
      
   
    const response = await axios.get(`http://localhost:5000/api/auth/user${query}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    );
    setUsers(response.data);
     } catch (err) {
      console.error(err);
      toast.error("User not found")

    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      let query = "";
      if (search.trim()) {
        query = `?search=${search}`
      }
      fetchUsers(query)
    }, 1000);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(()=>{

  },[])

  return (
    <section>
      <div className='flex justify-between'>
        <div className="flex items-center justify-center gap-3 ml-4 mb-4">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-2 rounded-xl shadow-lg transform hover:scale-110 transition-transform duration-300">
            <FaComments className="text-xl text-white" />
          </div>
          <h1 className="text-2xl font-bold">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-600">U</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-900">chat</span>
          </h1>
        </div>
        <div>
          <FaEllipsisV className="text-xl text-gray-700 absolute top-4 cursor-pointer" />
        </div>
      </div>
      {/* <h2 className='text-xl font-semibold text-gray-700 ml-2  right-0'>Contacts</h2> */}
      <div className='relative w-full'>

        <FaSearch className='absolute left-5 top-1/2 -translate-y-1/2 text-small text-gray-600' />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search...."
          className='pl-10 py-2 w-full border border-gray-500 font-medium ml-2 rounded-full' />

      </div>
      {
        // Contact Items - Example
        users &&  (users.map((user) =>
          
          <div key={user._id}>
            <div className="flex items-center p-3 border-b border-gray-300 hover:bg-gray-100 cursor-pointer">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {`${user.name?.[0]}`}
              </div>
              <div className="ml-4">
                <p className="text-gray-800 font-medium">{user.username}</p>
                <p className="text-gray-500 text-sm">{user.lastMessage}</p>
              </div>
            </div></div>))




      }
      <p>{console.log(users)}</p>

    </section>
  )
}

export default ContactList

import React, { useState } from 'react'
import { getAuth } from 'firebase/auth'
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const auth = getAuth()
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email
  });
  const {name, email} =formData;
  function onLogout(){
    auth.signOut()
    navigate("/");
  }
  return (
    <>
      <section className='max-w-6xl mx-auto flex justify-center items-center flex-col'>
        <h1 className='text-3xl text-center mt-6 font-bold'>My Profile</h1>
        <div className='w-full md:w-[50%] mt-6 px-3'>
          <form>
            {/* Name Input */}
            <input type='text' id='name' value={name} disabled className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out mb-4' />

            {/* Email Input */}
            <input type='email' id='email' value={email} disabled className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out mb-2' />

            <div className='flex justify-between whitespace-nowrap text-sm sm:text-lg mb-4'> 
              <p className='flex items-center'> Deseja alterar seu nome? 
                <span className='text-red-600 hover:text-red-700 cursor-pointer ml-1 transition ease-in-out duration-200'>Editar</span>
              </p>
              <p onClick={onLogout} className='text-blue-600 hover:text-blue-700 cursor-pointer ml-1 transition ease-in-out duration-200'> Sair </p>
            </div>



          </form>
        </div>
      </section>
    </>
  )
}

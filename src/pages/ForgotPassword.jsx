import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom';
import OAuth from '../components/OAuth';
import { toast } from 'react-toastify';
import { sendPasswordResetEmail, getAuth } from 'firebase/auth';



export default function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("");

  function onChange(e) {
    setEmail((prevState)=>(e.target.value))
  }

  async function onSubmit(e){
    e.preventDefault()
    try {
      const auth = getAuth()
      await sendPasswordResetEmail(auth, email)
      toast.success("Email de recuperação de senha enviado") 
      
    } catch (error) {
      toast.error("Erro ao enviar email de recuperação")
    }
  }

  return (
    <section>
      <h1 className='text-3xl text-center mt-6 font-bold'>
        Recuperar senha
      </h1>
      <div className='flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto'>
        <div className="md:w-[67%] lg:w-[50%] mb-12 md:mb-6">
          <img
            src='https://firebasestorage.googleapis.com/v0/b/rotavias.appspot.com/o/logo.jpeg?alt=media&token=7a7694dc-fd89-4827-9e42-8191225f64c4'
            alt='logoSingIn'
            onClick={() => navigate("/")}
            className='w-full rounded'
          />             
        </div>
        <div className='w-full md:w-[67%] lg:w-[40%] lg:ml-20'>
          <form onSubmit={onSubmit}>
            <input
              type='email'
              id="email" 
              value={email} 
              onChange={onChange}
              placeholder='Email address'
              className='w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out mb-4'
            />

           
            <div className='flex justify-between whitespace-nowrap text-sm sm:text-lg'>
              <p className="mb-6">Não tem um usuário? Crie um 
                <Link to="/sign-up" className='text-red-600 hover:text-red-700 transition duration-200 ease-in-out ml-1'> aqui</Link>
              </p>
              <p>
                <Link to={"/sign-in"} className='text-blue-600 hover:text-blue-700 transition duration-200 ease-in-out'> Fazer login
                </Link>
              </p>
            </div>
            <button type='submit' className='w-full bg-blue-600 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800'>
              Enviar um email de recuperação de senha
          </button>
          <div className='flex items-center my-4 before:border-t before:flex-1 before:border-gray-300 after:border-t after:flex-1 after:border-gray-300'>
            <p className='text-center font-semibold mx-4'>OU</p>
          </div>
          <OAuth/>
          </form>
        </div>
      </div>
    </section>
  )
}

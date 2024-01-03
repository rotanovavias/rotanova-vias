import React from 'react';
import { useLocation, useNavigate } from 'react-router';

export default function Header() {

  const location = useLocation()
  const navigate = useNavigate()
  console.log(location.pathname);
  function pathMathRoute(route){
    if (route === location.pathname){
      return true
    }
  }
  return (
      <div className='bg-white border-b shadow-sm sticky top-0 z-50'>
            <header className='flex justify-between items-center px-3 max-w-6xl mx-auto'>
              <img
                src='https://firebasestorage.googleapis.com/v0/b/rotanovavias.appspot.com/o/rota.svg?alt=media&token=0be8835b-8fd5-441b-95fd-134155535ea2'
                alt='logo'
                className='h-10 cursor-pointer'
                onClick={() => navigate("/")}
              />
              <ul className='flex space-x-5'>
                <li className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent
                ${pathMathRoute("/") && "text-black border-b-red-500"}`}
                  onClick={() => navigate("/")}
                >Home</li>

                <li className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent
                ${pathMathRoute("/vias") && "text-black border-b-red-500"}`} 
                onClick={() => navigate("/vias")}
                >Vias</li>

                <li className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent
                ${pathMathRoute("/sign-in") && "text-black border-b-red-500"}`}
                onClick={() => navigate("/sign-in")}
                >Entrar</li>
              </ul>
            </header>
          </div>
  );
}

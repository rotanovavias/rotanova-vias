import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import {getAuth, onAuthStateChanged} from 'firebase/auth'

export default function Header() {
  const [pageState, setPageState] = useState("Sign in");
  const location = useLocation()
  const navigate = useNavigate()
  const auth = getAuth();
  useEffect(() => {
    onAuthStateChanged(auth, (user)=>{
      if(user){
        setPageState("Perfil")
      } else {
        setPageState("Entrar");
      }
    });
  }, [auth])

  console.log(location.pathname);
  function pathMatchRoute(route){
    if (route === location.pathname){
      return true
    }
  }
  return (
      <div className='bg-white border-b shadow-sm sticky top-0 z-40'>
            <header className='flex justify-between items-center px-3 max-w-6xl mx-auto'>
              <img
                src='https://firebasestorage.googleapis.com/v0/b/rotavias.appspot.com/o/logo.jpeg?alt=media&token=7a7694dc-fd89-4827-9e42-8191225f64c4'
                alt='logo'
                className='h-10 cursor-pointer'
                onClick={() => navigate("/")}
              />
              <ul className='flex space-x-5'>
                <li className={`cursor-pointer py-3 text-sm font-semibold ${
                    pathMatchRoute("/") ? "text-black border-b-2 border-red-500" : "text-gray-400 border-b-2 border-transparent"
                  }`}
                  onClick={() => navigate("/")}
                >Buscar Via</li>

                {/* <li className={`cursor-pointer py-3 text-sm font-semibold ${
                    pathMatchRoute("/vias") ? "text-black border-b-2 border-red-500" : "text-gray-400 border-b-2 border-transparent"
                  }`}
                onClick={() => navigate("/vias")}
                >Vias</li> */}

                <li className={`cursor-pointer py-3 text-sm font-semibold ${
                    pathMatchRoute("/sign-in") || pathMatchRoute("/profile") ? "text-black border-b-2 border-red-500" : "text-gray-400 border-b-2 border-transparent"
                  }`}
                onClick={() => navigate("/profile")}
                >{pageState}</li>
              </ul>
            </header>
          </div>
  );
}

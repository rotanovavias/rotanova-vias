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
<div style={{ 
  backgroundColor: 'white', 
  borderBottom: '1px solid #000', 
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)', 
  position: 'sticky top-0' 
}}>
      <header style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '0 0.75rem', 
          maxWidth: '72rem', 
          margin: '0 auto' 
      }}>
        <img
          src='https://firebasestorage.googleapis.com/v0/b/rotanovavias.appspot.com/o/rota.svg?alt=media&token=0be8835b-8fd5-441b-95fd-134155535ea2'
          alt='logo'
          style={{ maxWidth: '100px', cursor: 'pointer' }}
          onClick={() => navigate("/")}
        />
        <ul style={{ display: 'flex', listStyle: 'none', padding: 0 }}>
          <li style={{
            paddingTop: '0.75rem', // Equivalente aproximado a py-3
            fontSize: '0.875rem', // Equivalente aproximado a text-sm
            fontWeight: '600', // Equivalente aproximado a font-semibold
            color: '#CBD5E0', // Equivalente aproximado a text-gray-400
            borderBottom: '3px solid transparent', // Equivalente aproximado a border-b-[3px] border-b-transparent
            ...(pathMathRoute("/") && {
              color: 'black', // Se a condição for verdadeira, aplique o estilo text-black
              borderBottomColor: '#f00', // Se a condição for verdadeira, aplique o estilo border-b-red-500
            cursor: "pointer",
            }),
            marginRight: '0.5rem',
          }} onClick={() => navigate("/")} >Home</li>
          <li style={{
            paddingTop: '0.75rem', // Equivalente aproximado a py-3
            fontSize: '0.875rem', // Equivalente aproximado a text-sm
            fontWeight: '600', // Equivalente aproximado a font-semibold
            color: '#CBD5E0', // Equivalente aproximado a text-gray-400
            borderBottom: '3px solid transparent', // Equivalente aproximado a border-b-[3px] border-b-transparent
            ...(pathMathRoute("/vias") && {
              color: 'black', // Se a condição for verdadeira, aplique o estilo text-black
              borderBottomColor: '#f00', // Se a condição for verdadeira, aplique o estilo border-b-red-500
              cursor: "pointer",
            }),
            marginRight: '0.5rem',
          }} onClick={() => navigate("/vias")}>Vias</li>
          <li style={{
            paddingTop: '0.75rem', // Equivalente aproximado a py-3
            fontSize: '0.875rem', // Equivalente aproximado a text-sm
            fontWeight: '600', // Equivalente aproximado a font-semibold
            color: '#CBD5E0', // Equivalente aproximado a text-gray-400
            borderBottom: '3px solid transparent', // Equivalente aproximado a border-b-[3px] border-b-transparent
            ...(pathMathRoute("/sign-in") && {
              color: 'black', // Se a condição for verdadeira, aplique o estilo text-black
              borderBottomColor: '#f00', // Se a condição for verdadeira, aplique o estilo border-b-red-500
              cursor: "pointer",
            }),
            marginRight: '0.5rem',
          }} onClick={() => navigate("/sign-in")}>Sign in</li>
        </ul>
      </header>
    </div>
  );
}

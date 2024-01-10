import React, { useState } from 'react'

export default function CreateVias() {
  const [formData, setFormData] = useState({
    type: "gesso",
    ct: "",
    nf: "",
    motorista: "",
    carregamento: "",
    descarga: "",
    dia: "",
    whatsapp: "",
    obs: ""
  });
  const {type, ct, nf, motorista, carregamento, descarga, dia, whatsapp, obs} = formData;
  function onChange(){}
  return (
    <main className='max-w-xl px-2 mx-auto'>
        <h1 className='3xl text-center mt-6 font-bold'>Cadastro de CT's</h1>
        <form>
            <p className='text-lg mt-6 font-semibold'>Tipo do produto</p>
            <div className='flex'>
                <button type='button' id='type' value='gesso' onClick={onChange} className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md- rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
                    type === 'gesso' ? "bg-white text-black" : "bg-slate-600 text-white"
                }`}>
                    Gesso
                </button>
                <button type='button' id='type' value='gesso' onClick={onChange} className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md- rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
                    type === 'adubo' ? "bg-white text-black" : "bg-slate-600 text-white"
                }`}>
                    Adubo
                </button>
            </div>
            {/* <p className='text-lg mt-6 font-semibold'>CT</p>
                <input type='number' id='ct' value={ct} onChange={onChange} placeholder='Número do CT' maxLength="5" minLength="4" required className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-2'/>

            <p className='text-lg mt-6 font-semibold'>Nota Fiscal</p>
                <input type='number' id='nf' value={nf} onChange={onChange}  required className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-2'/> */}
            <div className='flex space-x-6 mt-5 '>               
                <div className='flex items-center'>
                    <p className='text-lg font-semibold'>CT:</p>
                    <input
                        type='number'
                        id='ct'
                        value={ct}
                        onChange={onChange}
                        required
                        className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center'
                    />
                </div>
            
                <div className='flex items-center'>
                    <p className='text-lg font-semibold ml-2'>Nota Fiscal:</p>
                    <input
                        type='number'
                        id='nf'
                        value={nf}
                        onChange={onChange}
                        required
                        className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center'
                    />
                </div>
            </div>

           <p className='text-lg mt-6 font-semibold'>Motorista</p>
                <input type='text' id='motorista' value={motorista} onChange={onChange} required className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-2 text-center'/>     
                
            <p className='text-lg mt-6 font-semibold'>Local de Carregamento</p>
                <input type='text' id='carregamento' value={carregamento} onChange={onChange}  className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-2 text-center'/>

           <p className='text-lg mt-6 font-semibold'>Local de Entrega</p>
                <input type='text' id='descarga' value={descarga} onChange={onChange}  className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-2 text-center'/>
            
            <div className='flex space-x-6 mt-5 '>               
                <div className='flex items-center'>
                    <p className='text-lg font-semibold'>Data de emissão:</p>
                    <input
                        type='date'
                        id='dia'
                        value={dia}
                        onChange={onChange}
                        // required
                        className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center'
                    />
                </div>           
                <div className='flex items-center'>
                    <p className='text-lg font-semibold ml-2'>WhatsApp:</p>
                    <input
                        type='text'
                        id='whatsapp'
                        value={whatsapp}
                        onChange={onChange}
                        // required
                        className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center'
                    />
                </div>
            </div>
            <p className='text-lg mt-6 font-semibold'>Observações</p>
                <textarea type='text' id='obs' value={obs} onChange={onChange} required className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-2 text-center'/>

                <div className='mb-6'>
                    <p className='text-lg font-semibold'>Imagens</p>
                    <p className='text-gray-600'>A primeira imagem será a de capa (máx 6)</p>
                    <input 
                        type='file'
                        id='images'
                        onChange={onChange}
                        accept='.jpg,.png,.jpeg,.pdf' //pdf?
                        multiple
                        required
                        className='w-full px-3 py-1.5 text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:border-slate-600'
                    />
                </div>  
                <button type='submit' className='mb-6 w-full px-7 py-3 bg-blue-600 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out'>Enviar</button>
        </form>
    </main>
  )
}

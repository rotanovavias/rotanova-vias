import React, { useState } from 'react'
import Spinner from "../components/Spinner";
import { toast } from 'react-toastify';
import {getStorage, ref, uploadBytesResumable, getDownloadURL} from 'firebase/storage'
import {getAuth} from 'firebase/auth'
import {v4 as uuidv4} from "uuid"; 
import {addDoc, collection, serverTimestamp} from "firebase/firestore"
import {db} from "../firebase"
import { useNavigate } from 'react-router-dom';

export default function CreateVias() {
  const navigate = useNavigate()
  const auth = getAuth()
  const [geolocationEnabled] = useState(true) //desativado pois necessita metodo de pagamento
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "gesso",
    ct: "",
    nf: "",
    motorista: "",
    carregamento: "",
    descarga: "",
    dia: "",
    whatsapp: "",
    obs: "",
    latitude: 0,
    longitude: 0,
    images: {}
  });
  
  const {type, ct, nf, motorista, carregamento, descarga, dia, whatsapp, obs, latitude, longitude, images} = formData;
  function onChange(e){
    let boolean = null;
    if (e.target.value === "true"){
        boolean = true;
    }
    if (e.target.value === "false"){
        boolean = false;
    }
    //Files
    if (e.target.files){
        setFormData((prevState)=>({
            ...prevState,
            images: e.target.files
        }))
    }
    //Text/boolean/numbers
    if (!e.target.files){
        setFormData((prevState)=>({
            ...prevState,
            [e.target.id]: boolean ?? e.target.value,
        }));
    }
  }
  async function onSubmit(e){
    e.preventDefault();
    setLoading(true);
    if(images.length > 6){
        setLoading(false);
        toast.error("O número máximo de imagens permitido é 6");
        return;
    }
    // let geolocation = {}
    // let location
    // if(geolocationEnabled){
    //     precisa criar metodo de pagamento
    // }

    async function storeImage(image){
        return new Promise((resolve,reject) => {
            const storage = getStorage()
            const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
            const storageRef = ref(storage, filename);
            const uploadTask = uploadBytesResumable(storageRef, image);
            uploadTask.on("state_changed",
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log("Upload is " + progress + "% done");
                switch (snapshot.state) {
                    case "paused":
                        console.log("Upload is paused");
                        break;
                    case "running":
                        console.log("Upload is running");
                        break;
                }
            },
            (error) => {
                reject(error)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    resolve(downloadURL);
                });
            }
        );
    });
}
    
    const imgUrls = await Promise.all(
        [...images]
        .map((image) => storeImage(image))
        ).catch((error) => {
            setLoading(false)
            toast.error("Ocorreu um erro ao enviar as imagens!")
            return;
        });

    const formDataCopy = {
        ...formData, 
        imgUrls,
        timestamp: serverTimestamp(),
    };
    delete formDataCopy.images;
    !formDataCopy.offer && delete formDataCopy.discountedPrice;
    const docRef = await addDoc(collection(db, "listings"), formDataCopy);
    setLoading(false)
    toast.success("Via enviada!!")
    navigate(`/category/${formDataCopy.type}/${docRef.id}`);
  }
        if(loading){
    return <Spinner />;
  }
  return (
    <main className='max-w-xl px-2 mx-auto'>
        <h1 className='3xl text-center mt-6 font-bold'>Cadastro de CT's</h1>
        <form onSubmit={onSubmit}>
            <p className='text-lg mt-6 font-semibold'>Tipo do produto</p>
            <div className='flex'>
            <button 
                    type='button' 
                    id='type' 
                    value='gesso' 
                    onClick={onChange} 
                    className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md- rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
                    type === 'adubo' 
                        ? "bg-white text-black" 
                        : "bg-slate-600 text-white"
                }`}>
                    Gesso
                </button>
                <button 
                    type='button' 
                    id='type' 
                    value='adubo' 
                    onClick={onChange} 
                    className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md- rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
                    type === 'gesso' 
                        ? "bg-white text-black" 
                        : "bg-slate-600 text-white"
                }`}>
                    Adubo
                </button>
            </div>
            {/* <p className='text-lg mt-6 font-semibold'>CT</p>
                <input type='number' id='ct' value={ct} onChange={onChange} placeholder='Número do CT' maxLength="5" minLength="4" required className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-2'/>

            <p className='text-lg mt-6 font-semibold'>Nota Fiscal</p>
                <input type='number' id='nf' value={nf} onChange={onChange}  required className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-2'/> */}
            <div className='flex space-x-6 mt-7 '>               
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
                <textarea type='text' id='descarga' value={descarga} onChange={onChange}  className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-2 text-center'/>
                {!geolocationEnabled && (
                    <div className="flex space-x-6 justify-start mb-6">
                        <div className="">
                            <p className='text-lg font-semibold mr-4'>Latitude</p>
                                <input 
                                type='number' 
                                id='latitude' 
                                value={latitude} 
                                onChange={onChange}
                                min="-90"
                                max="90"
                                className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:text-gray-700 focus:border-slate-600 text-center mr-4'/>

                        </div>
                        <div className="">
                            <p className='text-lg font-semibold ml-4'>Longitude</p>
                                <input 
                                type='number' 
                                id='longitude' 
                                value={longitude} 
                                onChange={onChange}
                                min="-180"
                                max="180"
                                className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:text-gray-700 focus:border-slate-600 text-center ml-4'/>

                        </div>
                    </div>
                )}
            
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
                        min="10"
                        max="11"
                        // required
                        className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center'
                    />
                </div>
            </div>
            <p className='text-lg mt-6 font-semibold'>Observações</p>
                <textarea 
                        type='text' 
                        id='obs' 
                        value={obs} 
                        onChange={onChange} 
                        // required 
                        className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-2 text-center'/>

                <div className='mb-6'>
                    <p className='text-lg font-semibold'>Imagens</p>
                    <p className='text-gray-600'>A primeira imagem será a de capa (máx 6)</p>
                    <input 
                        type='file'
                        id='images'
                        onChange={onChange}
                        accept='.jpg,.png,.jpeg' //pdf?
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

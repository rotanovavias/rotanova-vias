import React, { useState } from 'react';
import Spinner from "../components/Spinner";
import { toast } from 'react-toastify';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { v4 as uuidv4 } from "uuid"; 
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from 'react-router-dom';

export default function CreateVias() {
  const navigate = useNavigate();
  const auth = getAuth();
  const [geolocationEnabled] = useState(true); // Desativado pois necessita método de pagamento
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "entregue",
    ct: "",
    nf: "",
    motorista: "",
    carregamento: "",
    descarga: "",
    dia: "",
    whatsapp: "55",
    obs: "",
    latitude: 0,
    longitude: 0,
    images: [],
  });

  const { type, ct, nf, motorista, carregamento, descarga, dia, whatsapp, obs, images } = formData;

  function onChange(e) {
    let boolean = null;
    if (e.target.value === "true") {
      boolean = true;
    }
    if (e.target.value === "false") {
      boolean = false;
    }

    // Files
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: [...prevState.images, ...Array.from(e.target.files)],
      }));
    }

    // Text/boolean/numbers
    if (!e.target.files) {
      let value = e.target.value;
      if (e.target.id === "motorista" || e.target.id === "carregamento" || e.target.id === "descarga") {
        // Converte para maiúsculas se o campo for "motorista", "carregamento" ou "descarga"
        value = value.toUpperCase();
      }

      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? value,
      }));
    }
  }

  function removeImage(index) {
    setFormData((prevState) => ({
      ...prevState,
      images: prevState.images.filter((_, i) => i !== index),
    }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
  
    if (images.length > 6) {
      setLoading(false);
      toast.error("O número máximo de imagens permitido é 6");
      return;
    }
  
    if (type === "entregue" && images.length === 0) {
      setLoading(false);
      toast.error("Por favor, envie pelo menos uma imagem caso essa via tenha sido entregue");
      return;
    }

    const imgUrls = [];
    for (const image of images) {
      const imgUrl = await storeImage(image);
      imgUrls.push(imgUrl);
    }

    // const dataLocal = new Date(`${dia}T12:00:00Z`);
    // const dataFormatada = new Date(dia).toLocaleDateString();

    const formDataCopy = {
      ...formData,
      dia: dia,
      imgUrls,
      timestamp: serverTimestamp(),
      userRef: auth.currentUser.uid,
    };

    delete formDataCopy.images;

    try {
      const docRef = await addDoc(collection(db, "listings"), formDataCopy);
      setLoading(false);
      toast.success("Via enviada!!");
      navigate(`/profile`);
    } catch (error) {
      console.error("Error adding document: ", error);
      setLoading(false);
      toast.error("Ocorreu um erro ao enviar a via!");
    }
  }

  async function storeImage(image) {
    return new Promise((resolve, reject) => {
      const storage = getStorage();
      const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
      const storageRef = ref(storage, filename);
      const uploadTask = uploadBytesResumable(storageRef, image);
      uploadTask.on(
        "state_changed",
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
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  }

  if (loading) {
    return <Spinner />;
  }

  return (
    <main className='max-w-xl px-2 mx-auto'>
      <h3 className='3xl text-center mt-6 font-bold'>Cadastro de CT's</h3>
      <form onSubmit={onSubmit} className="mt-8">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className='text-lg font-semibold'>Status de entrega</p>
            <div className='flex justify-between'>
              <button
                type='button'
                id='type'
                value='entregue'
                onClick={onChange}
                className={`flex-1 mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out ${
                  type === 'aEntregar'
                    ? "bg-white text-black"
                    : "bg-slate-600 text-white"
                }`}
              >
                Entregue
              </button>
              <button
                type='button'
                id='type'
                value='aEntregar'
                onClick={onChange}
                className={`flex-1 mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out ${
                  type === 'entregue'
                    ? "bg-white text-black"
                    : "bg-slate-600 text-white"
                }`}
              >
                A Entregar
              </button>
            </div>
          </div>
          <div>
            <p className='text-lg font-semibold'>CT:</p>
            <input
              type='number'
              id='ct'
              value={ct}
              onChange={onChange}
              required
              className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600'
            />
          </div>
          <div>
            <p className='text-lg font-semibold'>Nota Fiscal:</p>
            <input
              type='number'
              id='nf'
              value={nf}
              onChange={onChange}
              required
              className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600'
            />
          </div>
          <div>
            <p className='text-lg font-semibold'>Motorista</p>
            <input
              type='text'
              id='motorista'
              value={motorista}
              onChange={onChange}
              required
              className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600'
            />
          </div>
          <div>
            <p className='text-lg font-semibold'>Local de Carregamento</p>
            <input
              type='text'
              id='carregamento'
              value={carregamento}
              onChange={onChange}
              className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600'
            />
          </div>
          <div>
            <p className='text-lg font-semibold'>Local de Entrega</p>
            <input
              type='text'
              id='descarga'
              value={descarga}
              onChange={onChange}
              className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600'
            />
          </div>
          <div>
            <p className='text-lg font-semibold'>Data de emissão:</p>
            <input
              type='date'
              id='dia'
              value={dia}
              onChange={onChange}
              className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600'
            />
          </div>
          <div>
            <p className='text-lg font-semibold'>WhatsApp:</p>
            <input
              country='BR'
              type='text'
              id='whatsapp'
              value={whatsapp}
              onChange={onChange}
              min="10"
              max="11"
              className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600'
            />
          </div>
          <div className="col-span-2">
            <p className='text-lg font-semibold'>Observações</p>
            <textarea
              type='text'
              id='obs'
              value={obs}
              onChange={onChange}
              className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600'
            />
          </div>
          <div className="col-span-2">
            <p className='text-lg font-semibold'>Imagens</p>
            <p className='text-gray-600'>A primeira imagem será a de capa (máx 6)</p>
            {images.map((image, index) => (
              <div key={index} className='relative mt-2'>
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Imagem ${index + 1}`}
                  className='w-32 h-32 object-cover rounded'
                />
                <button
                  type='button'
                  onClick={() => removeImage(index)}
                  className='absolute top-0 right-0 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out'
                >
                  <svg
                    className='w-4 h-4 text-gray-600'
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 1a1 1 0 011 1v11a1 1 0 11-2 0V2a1 1 0 011-1zm-1.707 4.293a1 1 0 011.414 0L10 7.586l1.293-1.293a1 1 0 111.414 1.414L11.414 9l1.293 1.293a1 1 0 01-1.414 1.414L10 10.414l-1.293 1.293a1 1 0 01-1.414-1.414L8.586 10 7.293 8.707a1 1 0 010-1.414L8.586 6 7.293 4.707a1 1 0 010-1.414L8.586 3l1.293 1.293zM3.293 6.707a1 1 0 010-1.414L6 3.586l1.293-1.293a1 1 0 011.414 1.414L7.414 5l1.293 1.293a1 1 0 01-1.414 1.414L6 6.414l-1.293 1.293a1 1 0 11-1.414-1.414L4.586 5 3.293 3.707a1 1 0 010-1.414L4.586 2 5.879.707a1 1 0 111.414 1.414L7.414 5l1.293 1.293a1 1 0 11-1.414 1.414L6 6.414l-1.293 1.293a1 1 0 01-1.414-1.414L4.586 5 3.293 6.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            ))}
            <input
              type='file'
              id='images'
              onChange={onChange}
              accept='.jpg,.png,.jpeg'
              multiple
              className='hidden'
            />
            <label
              htmlFor="images"
              className='block mt-2 w-full px-3 py-1.5 text-center text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:border-slate-600 cursor-pointer'
            >
              Adicionar Imagens
            </label>
          </div>
          <div className="col-span-2">
            <button type='submit' className='w-full px-7 py-3 mt-6 bg-blue-600 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out'>
              Enviar
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}

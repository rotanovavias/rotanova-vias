import React, { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import { updateDoc, getDoc, serverTimestamp, doc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate, useParams } from "react-router-dom";

export default function EditVias() {
  const navigate = useNavigate();
  const auth = getAuth();
  const [loading, setLoading] = useState(false);
  const [listing, setListing] = useState(null);
  const [formData, setFormData] = useState({
    type: "entregue",
    ct: "",
    nf: "",
    motorista: "",
    carregamento: "",
    descarga: "",
    dia: "",
    whatsapp: "",
    obs: "",
    images: {},
  });
  
  // Adicione o estado para armazenar a data do formulário CreateVias
  const [createViasDate, setCreateViasDate] = useState('');

  const {
    type,
    ct,
    nf,
    motorista,
    carregamento,
    descarga,
    dia,
    whatsapp,
    obs,
    images,
  } = formData;

  const params = useParams();

  useEffect(() => {
    if (listing && listing.userRef !== auth.currentUser.uid) {
      toast.error("Você não pode editar esse arquivo!");
      navigate("/");
    }
  }, [auth.currentUser.uid, listing, navigate]);

  useEffect(() => {
    setLoading(true);
    async function fetchListing() {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const listingData = docSnap.data();
        setListing(listingData);
        setFormData({ ...listingData });
        setLoading(false);
      } else {
        navigate("/");
        toast.error("Erro, a página que está tentando acessar não existe!");
      }
    }
    fetchListing();
  }, [navigate, params.listingId]);

  function onChange(e) {
    let boolean = null;
    if (e.target.value === "true") {
      boolean = true;
    }
    if (e.target.value === "false") {
      boolean = false;
    }

    //Files
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }
    // Text/boolean/numbers
    if (!e.target.files) {
      let value = e.target.value;
      if (
        e.target.id === "motorista" ||
        e.target.id === "carregamento" ||
        e.target.id === "descarga"
      ) {
        // Converte para maiúsculas se o campo for "motorista", "carregamento" ou "descarga"
        value = value.toUpperCase();
      }

      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? value,
      }));
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    if (images && images.length > 6) {
      setLoading(false);
      toast.error("O número máximo de imagens permitido é 6");
      return;
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
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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

    let imgUrls = [];

    if (images && images.length > 0) {
      imgUrls = await Promise.all(
        [...images].map((image) => storeImage(image))
      ).catch((error) => {
        setLoading(false);
        toast.error("Ocorreu um erro ao enviar as imagens!");
        return;
      });
    }

    const formDataCopy = {
      ...formData,
      imgUrls: imgUrls.length > 0 ? imgUrls : formData.imgUrls, // Mantém as imagens existentes se não houver novas imagens selecionadas
      timestamp: serverTimestamp(),
      userRef: auth.currentUser.uid,
    };

    delete formDataCopy.images;
    !formDataCopy.offer && delete formDataCopy.discountedPrice;

    const docRef = doc(db, "listings", params.listingId);
    await updateDoc(docRef, formDataCopy);
    setLoading(false);
    toast.success("Via enviada!!");
    navigate(`/profile`);
  }

  if (loading || !listing) {
    return <Spinner />;
  }

  return (
    <main className="max-w-xl px-2 mx-auto">
      <h3 className="3xl text-center mt-6 font-bold">Edição de CT</h3>
      <form onSubmit={onSubmit} className="mt-8">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-lg font-semibold">Status de entrega</p>
            <div className="flex justify-between">
              <button
                type="button"
                id="type"
                value="entregue"
                onClick={onChange}
                className={`flex-1 mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out ${
                  type === "aEntregar"
                    ? "bg-white text-black"
                    : "bg-slate-600 text-white"
                }`}
              >
                Entregue
              </button>
              <button
                type="button"
                id="type"
                value="aEntregar"
                onClick={onChange}
                className={`flex-1 mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out ${
                  type === "entregue"
                    ? "bg-white text-black"
                    : "bg-slate-600 text-white"
                }`}
              >
                A Entregar
              </button>
            </div>
          </div>
          <div>
            <p className="text-lg font-semibold">CT:</p>
            <input
              type="number"
              id="ct"
              value={ct}
              onChange={onChange}
              required
              className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600"
            />
          </div>
          <div>
            <p className="text-lg font-semibold">Nota Fiscal:</p>
            <input
              type="number"
              id="nf"
              value={nf}
              onChange={onChange}
              required
              className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600"
            />
          </div>
          <div>
            <p className="text-lg font-semibold">Motorista</p>
            <input
              type="text"
              id="motorista"
              value={motorista}
              onChange={onChange}
              required
              className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600"
            />
          </div>
          <div>
            <p className="text-lg font-semibold">Local de Carregamento</p>
            <input
              type="text"
              id="carregamento"
              value={carregamento}
              onChange={onChange}
              className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600"
            />
          </div>
          <div>
            <p className="text-lg font-semibold">Local de Entrega</p>
            <input
              type="text"
              id="descarga"
              value={descarga}
              onChange={onChange}
              className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600"
            />
          </div>
          <div>
          <p className="text-lg font-semibold">Data de emissão:</p>
            <input
              type="date"
              id="dia"
              value={createViasDate || dia} 
              onChange={onChange}
              className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600"
            />
          </div>
          <div>
            <p className="text-lg font-semibold">WhatsApp:</p>
            <input
              country="BR"
              type="text"
              id="whatsapp"
              value={whatsapp}
              onChange={onChange}
              min="10"
              max="11"
              className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600"
            />
          </div>
          <div className="col-span-2">
            <p className="text-lg font-semibold">Observações</p>
            <textarea
              type="text"
              id="obs"
              value={obs}
              onChange={onChange}
              className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600"
            />
          </div>

          <div className="mt-6">
            <label htmlFor="images" className="block text-lg font-semibold">
              Imagens
            </label>
            <p className="text-gray-600">
              A primeira imagem será a de capa (máx 6)
            </p>
            <input
              type="file"
              id="images"
              onChange={onChange}
              accept=".jpg,.png,.jpeg" //pdf?
              multiple
              className="w-full px-3 py-1.5 text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:border-slate-600 mt-2"
            />
          </div>

          <button
            type="submit"
            className="mt-6 w-full px-7 py-3 bg-blue-600 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
          >
            Atualizar
          </button>
        </div>
      </form>
    </main>
  );
}

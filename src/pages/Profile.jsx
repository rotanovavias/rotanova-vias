import React, { useEffect, useState } from 'react'
import { getAuth, updateProfile } from 'firebase/auth'
import { collection, doc, orderBy, query, updateDoc, getDocs, where } from 'firebase/firestore'; 
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { db } from '../firebase';
import { FaTruckArrowRight } from "react-icons/fa6";
import ListingItem from '../components/ListingItem';


export default function Profile() {
  const auth = getAuth()
  const navigate = useNavigate();
  const [changeDetail, setChangeDetail] = useState(false)
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email
  });
  const {name, email} =formData;
  function onLogout(){
    auth.signOut()
    navigate("/");
  }
  function onChange(e){
    setFormData((prevState)=>({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  }
  async function onSubmit(){
    try {
      if(auth.currentUser.displayName !== name){
        // update displayName in firebase auth
        await updateProfile(auth.currentUser, {
          displayName: name,
        });

        //update name in firestore
        const docRef = doc(db, "users", auth.currentUser.uid)
        await updateDoc(docRef, {
          name,
        })
      }
      toast.success("Nome do usuário foi alterado com sucesso!");
    } catch (error) {
      toast.error("Não foi possível alterar os dados do usuário!")
    }
  }

  useEffect(()=>{
    async function fetchUserListings(){
      setLoading(true);
      const listingRef = collection(db, "listings")
      const q = query(listingRef, where("userRef", "==", auth.currentUser.uid), orderBy("timestamp", "desc")
      );
      const querySnap = await getDocs(q);
      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listings);
      setLoading(false);
    }
    fetchUserListings();
  }, [auth.currentUser.uid])
  return (
    <>
      <section className='max-w-6xl mx-auto flex justify-center items-center flex-col'>
        <h1 className='text-3xl text-center mt-6 font-bold'>Perfil</h1>
        <div className='w-full md:w-[50%] mt-6 px-3'>
          <form>
            {/* Name Input */}
            <input type='text' id='name' value={name} disabled={!changeDetail} onChange={onChange} className={`w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out mb-4 ${changeDetail && "bg-red-200 focus:bg-red-200"}`} />

            {/* Email Input */}
            <input type='email' id='email' value={email} disabled className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out mb-2' />

            <div className='flex justify-between whitespace-nowrap text-sm sm:text-lg mb-4'> 
              <p 
               onClick={() => {
                changeDetail && onSubmit()
                setChangeDetail((prevState) => !prevState)
               }}
               className='flex items-center'> Deseja alterar seu nome? 
                <span className='text-red-600 hover:text-red-700 cursor-pointer ml-1 transition ease-in-out duration-200'>{changeDetail ? "Aplicar alterações" : "Alterar"}</span>
              </p>
              <p onClick={onLogout} className='text-blue-600 hover:text-blue-700 cursor-pointer ml-1 transition ease-in-out duration-200'> Sair </p>
            </div>
          </form>
          <button type='submit' className='w-full bg-blue-600 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800 mt-4'>
            <Link to={"/create-vias"} className='flex justify-center items-center ' >
              <FaTruckArrowRight className='mr-3 text-3xl bg-blue-500 rounded-full p-1 border-2'/>
                Enviar novos canhotos
            </Link>
          </button>
        </div>
      </section>
      <div className="max-w-6xl px-3 mt-6 mx-auto">
        {!loading && listings.length > 0 && (
          <>
          <h2 className='text-2xl text-center font-semibold'>Meus canhotos enviados</h2>
            <ul>
              {listings.map((listing)=>(
                <ListingItem
                  key={listing.id}
                  id={listing.id}
                  listing={listing.data}
                  />

              ))}
            </ul>
          </>
        )} 
      </div>
    </>
  )
}

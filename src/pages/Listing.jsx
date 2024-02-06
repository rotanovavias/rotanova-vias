import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { db } from "../firebase";
import Spinner from "../components/Spinner";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { EffectFade, Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css/bundle";
import { FaMapMarkerAlt, FaArrowRight } from "react-icons/fa";
import { BsWhatsapp } from "react-icons/bs";

export default function Listing() {
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  SwiperCore.use([Autoplay, Navigation, Pagination]);
  useEffect(() => {
    async function fetchListing() {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListing(docSnap.data());
        setLoading(false);
      }
    }
    fetchListing();
  }, [params.listingId]);
  if (loading) {
    return <Spinner />;
  }

  return (
    <main>
      <Swiper
        slidesPerView={1}
        pagination={{ type: "progressbar" }}
        effect="fade"
        modules={[EffectFade]}
        autoplay={{ delay: 4500 }}
      >
        {listing.imgUrls.map((url, index) => (
          <SwiperSlide key={index}>
              <div
                className="relative w-full overflow-hidden h-[300px]"
                style={{
                  background: `url(${listing.imgUrls[index]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
              ></div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="m-4 flex flex-col md:flex-row max-w-6xl lg:mx-auto p-4 rounded-lg border-3 shadow-lg bg-white lg:space-x-5">
        <div className="w-full h-[300px] lg-[500px] ">
          <p className="text-2xl font-bold mb-3 text-blue-900">
            CT: {listing.ct} - Motorista: {listing.motorista}
          </p>
          <p className="flex items-center mt-6 mb-3 font-semibold">
            <FaMapMarkerAlt className="text-green-700 mr-1" />
            {listing.carregamento}{" "}
            <FaArrowRight className="mr-1 ml-1 text-green-900" />
            {listing.descarga}
          </p>
          <p className=" flex items-center mt-1">
            Data de emissão do CT:{" "}
            <span className="text-pink-900 ml-1">
              {new Date(listing.dia).toLocaleDateString("pt-BR")}
            </span>
          </p>
          <p className="">
            Número da nota fiscal: <span>{listing.nf}</span>
          </p>
          <p className="mt-20">
            Status: <span className="blinking-text">{listing.obs}</span>
          </p>
          <p className="text-blue-900 mt-3 flex items-center">
            Entrar em contato com o Motorista?
            <BsWhatsapp size={20} className="text-green-900 ml-2 mr-1" />
            <a
              href={`https://api.whatsapp.com/send?phone=${
                listing.whatsapp
              }&text=Olá ${listing.motorista}, a entrega do CT ${
                listing.ct
              } de ${listing.carregamento} para ${
                listing.descarga
              } do dia ${new Date(listing.dia).toLocaleDateString(
                "pt-BR"
              )}, foi efetuada? Por favor, nos envie a volta assinada para que possamos dar baixa no sistema! A Rota Nova agradece!`}
              className="text-green-900 hover:underline cursor-pointer hover:text-green-950"
            >
              {listing.whatsapp}
            </a>
          </p>
        </div>

        <div className="w-full h-[300px] lg-[500px] z-10 overflow-x-hidden">
          <Swiper
            slidesPerView={1}
            navigation
            effect="fade"
            modules={[EffectFade]}
          >
            {listing.imgUrls.map((url, index) => (
              <SwiperSlide key={index}>
                <a
                  href={listing.imgUrls[index]}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div
                    className="relative w-full overflow-hidden h-[300px]"
                    style={{
                      background: `url(${listing.imgUrls[index]}) center no-repeat`,
                      backgroundSize: "contain", // Altere o tamanho da imagem para 'contain'
                    }}
                  ></div>
                </a>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </main>
  );
}

import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { useState, useEffect } from "react";
import Spinner from "../components/Spinner";
import { db } from "../firebase";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay, Navigation, Pagination } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import { useNavigate } from "react-router";

export default function Slider() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  SwiperCore.use([Autoplay, Pagination, Navigation]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchListings() {
      const listingsRef = collection(db, "listings");
      const q = query(listingsRef, orderBy("timestamp", "desc"), limit(6));
      const querySnap = await getDocs(q);
      const listings = [];
      
      querySnap.forEach((doc) => {
        const data = doc.data();
        // Verifica se há imagens na lista de URLs
        if (data.imgUrls && data.imgUrls.length > 0) {
          listings.push({
            id: doc.id,
            data: data,
          });
        }
      });

      setListings(listings);
      setLoading(false);
    }
    fetchListings();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (!listings || listings.length === 0) {
    return null;
  }

  return (
    <Swiper
      slidesPerView={1}
      pagination={{ type: "progressbar" }}
      effect="fade"
      modules={[EffectFade]}
      autoplay={{ delay: 3000 }}
    >
      {listings.map(({ data, id }) => (
        <SwiperSlide key={id} onClick={() => navigate(`/category/${data.type}/${id}`)}>
          <div
            style={{
              background: `url(${data.imgUrls[0]}) center, no-repeat`,
              backgroundSize: "cover",
            }}
            className="relative w-full h-[300px] overflow-hidden"
          ></div>
          <p className="text-[#f1faee] absolute left-1 top-3 font-medium max-w-[90%] bg-[#457b9d] shadow-lg opacity-90 p-2 rounded-br-3xl">{data.ct}</p>
          <p className="text-[#f1faee] absolute left-1 bottom-1 font-semibold max-w-[90%] bg-[#e63946] shadow-lg opacity-90 p-2 rounded-tr-3xl">{data.descarga}</p>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

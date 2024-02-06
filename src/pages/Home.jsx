import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  or
} from "firebase/firestore";
import { db } from "../firebase";
import Slider from "../components/Slider";
import ListingItem from "../components/ListingItem";

export default function Home() {
  const [listings, setListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchListings() {
      try {
        const listingRef = collection(db, "listings");
        let q = query(listingRef, orderBy("timestamp", "desc"), limit(4));

        // If search term is provided, add where clauses to the query
        if (searchTerm.trim() !== "") {
          q = query(
            listingRef,
            or(
              where("ct", "==", searchTerm),
              where("nf", "==", searchTerm),
              where("motorista", "==", searchTerm.toUpperCase()),
              where("carregamento", "==", searchTerm.toUpperCase()),
              where("descarga", "==", searchTerm.toUpperCase()),
              where("dia", "==", searchTerm)
            ),
            orderBy("timestamp", "desc"),
            limit(4)
          );
        }

        const querySnap = await getDocs(q);
        const fetchedListings = [];
        querySnap.forEach((doc) => {
          fetchedListings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setListings(fetchedListings);
      } catch (error) {
        console.log("Error fetching listings:", error);
      }
    }

    fetchListings();
  }, [searchTerm]);

  const handleSearch = () => {
    // Fetch listings with the provided search term
    setSearchTerm(searchTerm.trim());
  };

  return (
    <div>
      <Slider />
      <section className="bg-gray p-4 rounded-lg w-full max-w-8xl mx-auto">
        <div className="flex justify-center items-center gap-2">
          <input
            id="searchInput"
            placeholder="Buscar por CT, NF, motorista, carregamento ou descarga"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border-2 rounded-lg h-9 px-3 outline-none border-gray-300 focus:outline-none focus:border-blue-500"
          />
          <button
            className="bg-blue-500 h-9 px-8 rounded-lg text-white font-medium text-lg"
            onClick={handleSearch}
          >
            Buscar
          </button>
        </div>
      </section>
      {/* <main className="grid gird-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {listings.map((listing) => (
          <div key={listing.id}>
            <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {listings.map((listing) => (
                <div key={listing.id}>
                  <ListingItem listing={listing.data} id={listing.id} />
                </div>
              ))}
            </main>
          </div>
        ))}
      </main> */}
      <main className="grid gird-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {searchTerm.trim() !== "" &&
          listings.map((listing) => (
            <div key={listing.id}>
              <ListingItem listing={listing.data} id={listing.id} />
            </div>
          ))}
      </main>
    </div>
  );
}

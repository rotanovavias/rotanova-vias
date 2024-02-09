import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";
import ListingItem from "../components/ListingItem";

export default function Vias() {
  const [listings, setListings] = useState([]);
  const [sortBy, setSortBy] = useState("data"); // Opções: "data", "entregue", "naoEntregue"

  useEffect(() => {
    async function fetchListings() {
      try {
        const listingRef = collection(db, "vias");
        let q = query(listingRef);

        // Ordenar por data ou filtrar por status de entrega
        if (sortBy === "data") {
          q = query(listingRef, orderBy("data"));
        } else if (sortBy === "entregue") {
          q = query(listingRef, where("entregue", "==", true));
        } else if (sortBy === "naoEntregue") {
          q = query(listingRef, where("entregue", "==", false));
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
  }, [sortBy]);

  return (
    <div>
      <h1>Vias</h1>
      <div>
        <label>Ordenar por:</label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="data">Data</option>
          <option value="entregue">Entregues</option>
          <option value="naoEntregue">Não Entregues</option>
        </select>
      </div>
      <div>
        {listings.map((listing) => (
          <div key={listing.id}>
            <ListingItem listing={listing.data} id={listing.id} />
          </div>
        ))}
      </div>
    </div>
  );
}

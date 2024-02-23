import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  or,
} from "firebase/firestore";
import { db } from "../firebase";
import Slider from "../components/Slider";
import ListingItem from "../components/ListingItem";

export default function Home() {
  const [listings, setListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("timestamp");
  const [sortDirection, setSortDirection] = useState("desc");
  const [isTableView, setIsTableView] = useState(true);

  useEffect(() => {
    async function fetchListings() {
      try {
        const listingRef = collection(db, "listings");
        let q = query(listingRef, orderBy(sortBy, sortDirection), limit(24));

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
            orderBy(sortBy, sortDirection),
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
  }, [searchTerm, sortBy, sortDirection]);

  const handleSearch = () => {
    setSearchTerm(searchTerm.trim());
  };

  const handleSort = (sortByField) => {
    if (sortBy === sortByField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(sortByField);
      setSortDirection("asc");
    }
  };

  const toggleView = () => {
    setIsTableView((prevValue) => !prevValue);
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
            className="bg-blue-500 h-9 px-8 rounded-lg text-white font-medium text-lg shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800"
            onClick={handleSearch}
          >
            Buscar
          </button>
          <button
            className="bg-gray-400 h-9 px-8 rounded-lg text-white font-medium text-lg flex items-center shadow-md hover:bg-gray-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-gray-800"
            onClick={toggleView}
          >
            {isTableView ? "Grade" : "Tabela"}
          </button>
        </div>
      </section>
      <main>
        {isTableView ? (
          <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden shadow-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  <button
                    className="text-indigo-600 hover:text-indigo-900 w-full px-7 py-3 text-sm font-medium uppercase  ease-in-out"
                    onClick={() => handleSort("ct")}
                  >
                    <span className="sr-only">CT</span>
                    CT
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  <button
                    className="text-indigo-600 hover:text-indigo-900 w-full px-7 py-3 text-sm font-medium uppercase  ease-in-out"
                    onClick={() => handleSort("nf")}
                  >
                    <span className="sr-only">NF</span>
                    NF
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  <button
                    className="text-indigo-600 hover:text-indigo-900 w-full px-7 py-3 text-sm font-medium uppercase  ease-in-out"
                    onClick={() => handleSort("motorista")}
                  >
                    <span className="sr-only">Motorista</span>
                    Motorista
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  <button
                    className="text-indigo-600 hover:text-indigo-900 w-full px-7 py-3 text-sm font-medium uppercase ease-in-out"
                    onClick={() => handleSort("carregamento")}
                  >
                    <span className="sr-only">Carregamento</span>
                    Carregamento
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  <button
                    className="text-indigo-600 hover:text-indigo-900 w-full px-7 py-3 text-sm font-medium uppercase ease-in-out"
                    onClick={() => handleSort("descarga")}
                  >
                    <span className="sr-only">Descarga</span>
                    Descarga
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  <button
                    className="text-indigo-600 hover:text-indigo-900 w-full px-7 py-3 text-sm font-medium uppercase ease-in-out"
                    // className=" hover:text-indigo-900 w-full bg-blue-600 text-white px-7 py-3 text-sm font-medium uppercase rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800 mt-4"
                    onClick={() => handleSort("dia")}
                  >
                    <span className="sr-only">Dia</span>
                    Dia
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {listings.map((listing) => (
                <tr key={listing.id} className="hover:bg-gray-100">
                  <td className="px-6 py-4 text-sm text-center hover:text-blue-900 font-medium uppercase rounded shadow-md ease-in-out">
                    <Link
                      to={`/category/${listing.data.type}/${listing.id}`}
                      // className="text-indigo-600 hover:text-indigo-900"
                    >
                      {listing.data.ct}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-center hover:text-blue-900 font-medium uppercase rounded shadow-md ease-in-out">
                    {" "}
                    <Link
                      to={`/category/${listing.data.type}/${listing.id}`}
                      // className="text-indigo-600 hover:text-indigo-900"
                    >
                      {listing.data.nf}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-center hover:text-blue-900 font-medium uppercase rounded shadow-md ease-in-out">
                    <Link
                      to={`/category/${listing.data.type}/${listing.id}`}
                      // className="text-indigo-600 hover:text-indigo-900"
                    >
                      {listing.data.motorista}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-center hover:text-blue-900 font-medium uppercase rounded shadow-md ease-in-out">
                    {" "}
                    <Link
                      to={`/category/${listing.data.type}/${listing.id}`}
                      // className="text-indigo-600 hover:text-indigo-900"
                    >
                      {listing.data.carregamento}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-center hover:text-blue-900 font-medium uppercase rounded shadow-md ease-in-out">
                    {" "}
                    <Link
                      to={`/category/${listing.data.type}/${listing.id}`}
                      // className="text-indigo-600 hover:text-indigo-900"
                    >
                      {listing.data.descarga}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-center hover:text-blue-900 font-medium uppercase rounded shadow-md ease-in-out">
                    {" "}
                    <Link
                      to={`/category/${listing.data.type}/${listing.id}`}
                      // className="text-indigo-600 hover:text-indigo-900"
                    >
                      {listing.data.dia}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {listings.map((listing) => (
              <div
                key={listing.id}
                className="bg-white shadow-md rounded-md p-4 hover:shadow-lg"
              >
                <ListingItem listing={listing.data} id={listing.id} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

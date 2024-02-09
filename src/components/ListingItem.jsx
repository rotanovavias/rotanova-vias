import React from 'react';
import { Link } from "react-router-dom";
import { MdLocationOn, MdEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa";

export default function ListingItem({ listing, id, onDelete, onEdit, colorClass }) {
  // const formattedDate = new Date(listing.dia).toLocaleDateString('pt-BR');

  return (
    <li className="relative bg-white flex flex-col justify-between items-center shadow-md hover:shadow-xl rounded-md overflow-hidden transition-shadow duration-150 m-[10px]">
      <Link to={`/category/${listing.type}/${id}`}>
        <img
          className="h-[170px] w-full object-cover hover:scale-105 transition-scale duration-200 ease-in"
          loading="lazy"
          src={listing.imgUrls[0]}
        />

        <p className="absolute top-2 left-2 bg-[#3377cc] text-white uppercase text-xs font-semibold rounded-md px-2 py-1 shadow-lg">
          {/* {formattedDate} */}
          {listing.dia}
        </p>

        <div className="w-full p-[10px]">
          <div className="flex items-center space-x-1">
            <MdLocationOn className="h-4 w-4 text-green-600" />
            <p className="font-semibold text-sm mb-[2px] text-gray-600 truncate">{listing.descarga}</p>
          </div>
          <p className="font-semibold m-0 text-xl">
            CT: {listing.ct}
          </p>
          <div className="">
            <div className="flex items-center mt-[10px] space-x-3">
              <p className="text-[#457b9d] mt-2 font-semibold">{listing.motorista}</p>
            </div>
          </div>
        </div>
      </Link>
      {onDelete && (
        <FaTrash
          className="absolute bottom-2 right-2 h-[14px] cursor-pointer text-red-500"
          onClick={() => onDelete(listing.id)}
        />
      )}
      {onEdit && (
        <MdEdit
          className="absolute bottom-2 right-7 h-[14px] cursor-pointer"
          onClick={() => onEdit(listing.id)}
        />
      )}
    </li>
  );
}

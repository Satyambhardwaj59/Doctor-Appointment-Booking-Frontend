"use client";

import { useEffect, useContext, useState } from "react";
import Image from "next/image";
import { AdminContext } from "@/context/AdminContext";

export default function AdminDoctorsListPage() {
  const { doctors, aToken, getAllDoctors, changeAvailability } =
    useContext(AdminContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpeciality, setFilterSpeciality] = useState("all");

  useEffect(() => {
    if (aToken) {
      getAllDoctors();
    }
  }, [aToken, getAllDoctors]);

  const filteredDoctors = doctors.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.speciality.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpec =
      filterSpeciality === "all" || item.speciality === filterSpeciality;
    return matchesSearch && matchesSpec;
  });

  return (
    <div className="m-5 max-h-[90vh] overflow-y-auto">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">All Doctors</h1>
          <p className="text-sm text-gray-500">
            Manage provider listings, specialities, and clinic availability.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Search by name or specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <select
            value={filterSpeciality}
            onChange={(e) => setFilterSpeciality(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Specialties</option>
            <option value="General physician">General physician</option>
            <option value="Gynecologist">Gynecologist</option>
            <option value="Dermatologist">Dermatologist</option>
            <option value="Pediatricians">Pediatricians</option>
            <option value="Neurologist">Neurologist</option>
            <option value="Gastroenterologist">Gastroenterologist</option>
          </select>
        </div>
      </div>

      {filteredDoctors.length === 0 ? (
        <div className="bg-white border rounded-xl p-12 text-center text-gray-500">
          No doctors found matching your filter criteria.
        </div>
      ) : (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredDoctors.map((item) => (
            <div
              key={item._id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow group flex flex-col justify-between"
            >
              <div className="relative w-full h-48 bg-indigo-50 flex items-center justify-center overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  src={typeof item.image === "string" ? item.image : ""}
                  alt={item.name}
                />
                <span
                  className={`absolute top-2 right-2 text-xs font-semibold px-2 py-0.5 rounded-full ${
                    item.available
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {item.available ? "Available" : "Unavailable"}
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-gray-800 text-base font-semibold">
                    {item.name}
                  </h2>
                  <p className="text-indigo-600 text-xs font-medium mt-0.5">
                    {item.speciality}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    {item.degree} • {item.experience}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 mt-3 border-t border-gray-100 text-xs">
                  <span className="text-gray-600">Fee: ${item.fees}</span>
                  <label className="flex items-center gap-1.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      className="accent-indigo-600 rounded cursor-pointer"
                      checked={Boolean(item.available)}
                      onChange={() => changeAvailability(item._id)}
                    />
                    <span className="text-gray-600 font-medium">Available</span>
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

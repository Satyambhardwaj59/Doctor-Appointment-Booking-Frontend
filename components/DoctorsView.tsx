'use client'

import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppContext } from '../context/AppContext';
import { Doctor } from '../types';

interface DoctorsViewProps {
  speciality?: string;
}

const specialitiesList = [
  'General physician',
  'Gynecologist',
  'Dermatologist',
  'Pediatricians',
  'Neurologist',
  'Gastroenterologist',
];

const DoctorsView: React.FC<DoctorsViewProps> = ({ speciality }) => {
  const [filterDoc, setFilterDoc] = useState<Doctor[]>([]);
  const [showFilter, setShowFilter] = useState(false);
  const router = useRouter();
  const { doctors } = useContext(AppContext);

  const decodedSpeciality = speciality ? decodeURIComponent(speciality) : undefined;

  const applyFilter = () => {
    if (decodedSpeciality) {
      setFilterDoc(doctors.filter(doc => doc.speciality.toLowerCase() === decodedSpeciality.toLowerCase()));
    } else {
      setFilterDoc(doctors);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [doctors, decodedSpeciality]);

  const handleSpecialityClick = (spec: string) => {
    if (decodedSpeciality === spec) {
      router.push('/doctors');
    } else {
      router.push(`/doctors/${encodeURIComponent(spec)}`);
    }
  };

  return (
    <div>
      <h1 className='text-gray-600 text-base font-normal'>Browse through the doctors specialist</h1>
      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
        <button 
          className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter ? 'bg-indigo-600 text-white' : ''}`} 
          onClick={() => setShowFilter(!showFilter)}
          aria-expanded={showFilter}
        >
          Filters
        </button>

        <div className={`flex-col gap-4 text-sm text-gray-600 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
          {specialitiesList.map((spec) => (
            <p 
              key={spec}
              onClick={() => handleSpecialityClick(spec)} 
              className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
                decodedSpeciality?.toLowerCase() === spec.toLowerCase() ? "bg-indigo-100 text-black font-medium" : "hover:bg-gray-50"
              }`}
            >
              {spec}
            </p>
          ))}
        </div>

        <div className='w-full grid grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))] gap-4 gap-y-6'>
          {filterDoc.map((item, index) => {
            const imgSrc = typeof item.image === 'string' ? item.image : (item.image as any)?.src || '';
            return (
              <div 
                onClick={() => router.push(`/appointment/${item._id}`)} 
                className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500 bg-white' 
                key={index}
                role="button"
                tabIndex={0}
                aria-label={`View doctor profile for ${item.name}`}
              >
                <img 
                  className='bg-blue-50 w-full aspect-square object-cover' 
                  src={imgSrc} 
                  alt={`Photo of ${item.name}`} 
                  loading="lazy"
                />
                <div className='p-4'>
                  <div className={`flex items-center gap-2 text-sm text-center ${item.available ? 'text-green-500' : 'text-gray-500'}`}>
                    <span className={`w-2 h-2 ${item.available ? 'bg-green-500' : 'bg-gray-500'} rounded-full inline-block`}></span>
                    <p>{item.available ? 'Available' : 'Not Available'}</p>
                  </div>
                  <p className='text-gray-900 text-lg font-medium mt-1'>{item.name}</p>
                  <p className='text-gray-600 text-sm'>{item.speciality}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DoctorsView;

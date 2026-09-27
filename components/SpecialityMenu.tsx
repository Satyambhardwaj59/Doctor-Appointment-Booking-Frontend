import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { specialityData } from '../assets/assets';

const SpecialityMenu: React.FC = () => {
  return (
    <section className='flex flex-col items-center gap-8 py-16 text-gray-800' id='speciality' aria-label="Browse by Speciality">
      <h2 className='text-3xl font-medium text-gray-900'>Find by Speciality</h2>
      <p className='sm:w-1/3 text-center text-sm text-gray-600'>
        Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.
      </p>
      <div className='flex sm:justify-center gap-4 w-full pt-6 overflow-x-auto'>
        {specialityData.map((item, index) => (
          <Link 
            className='flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500' 
            key={index} 
            href={`/doctors/${encodeURIComponent(item.speciality)}`}
          >
            <Image className='w-16 sm:w-24 mb-2 object-contain' src={item.image} alt={item.speciality} />
            <p className='text-gray-700 font-medium'>{item.speciality}</p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default SpecialityMenu;

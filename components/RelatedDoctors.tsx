'use client'

import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppContext } from '../context/AppContext';
import { Doctor } from '../types';

interface RelatedDoctorsProps {
  speciality: string;
  docId: string;
}

const RelatedDoctors: React.FC<RelatedDoctorsProps> = ({ speciality, docId }) => {
  const { doctors } = useContext(AppContext);
  const router = useRouter();
  const [relDoc, setRelDocs] = useState<Doctor[]>([]);

  useEffect(() => {
    if (doctors.length > 0 && speciality) {
      const doctorsData = doctors.filter((doc) => doc.speciality === speciality && doc._id !== docId);
      setRelDocs(doctorsData);
    }
  }, [doctors, speciality, docId]);

  return (
    <section className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10' aria-label="Related Doctors">
      <h2 className='text-3xl font-medium'>Related Doctors</h2>
      <p className='sm:w-1/3 text-center text-sm text-gray-600'>Simply browse through our extensive list of trusted doctors.</p>
      <div className='w-full grid grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))] gap-4 gap-y-6 px-3 sm:px-0'>
        {relDoc.slice(0, 5).map((item, index) => {
          const imgSrc = typeof item.image === 'string' ? item.image : (item.image as any)?.src || '';
          return (
            <div 
              onClick={() => {
                router.push(`/appointment/${item._id}`);
                if (typeof window !== 'undefined') window.scrollTo(0, 0);
              }} 
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
      <button 
        onClick={() => {
          router.push('/doctors');
          if (typeof window !== 'undefined') window.scrollTo(0, 0);
        }} 
        className='bg-blue-100 text-gray-600 px-12 py-3 rounded-full mt-10 cursor-pointer hover:bg-blue-200 transition-colors'
      >
        more
      </button>
    </section>
  );
};

export default RelatedDoctors;

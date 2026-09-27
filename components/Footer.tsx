'use client'

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { assets } from '../assets/assets';

const Footer: React.FC = () => {
  return (
    <footer className='md:mx-10' aria-label="Site Footer">
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
        {/* ********* Left Section ****** */}
        <div>
          <Image className='mb-5 w-40 object-contain' src={assets.logo_one} alt="Docify Logo" />
          <p className='w-full md:w-2/3 text-gray-600 leading-6'>
            Docify is an online doctor appointment booking app that connects patients with verified healthcare professionals. Users can search by specialty, check availability, and book instant appointments. It supports video consultations, digital prescriptions, and medical record storage. Docify ensures secure, fast, and convenient healthcare access anytime, anywhere.
          </p>
        </div>

        {/* ********* Center Section ****** */}
        <div>
          <p className='text-xl font-medium mb-5 text-gray-900'>COMPANY</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li>
              <Link href='/' className='cursor-pointer hover:text-indigo-600 transition-colors'>Home</Link>
            </li>
            <li>
              <Link href='/about' className='cursor-pointer hover:text-indigo-600 transition-colors'>About us</Link>
            </li>
            <li>
              <Link href='/contact' className='cursor-pointer hover:text-indigo-600 transition-colors'>Contact us</Link>
            </li>
            <li>
              <Link href='/about' className='cursor-pointer hover:text-indigo-600 transition-colors'>Privacy policy</Link>
            </li>
          </ul>
        </div>

        {/* ********* Right Section ****** */}
        <div>
          <p className='text-xl font-medium mb-5 text-gray-900'>GET IN TOUCH</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li><a href="tel:+12124567890" className="hover:text-indigo-600 transition-colors">+1-212-456-7890</a></li>
            <li><a href="mailto:support@docify.com" className="hover:text-indigo-600 transition-colors">support@docify.com</a></li>
          </ul>
        </div>
      </div>

      {/* ******* Copyright Section ********* */}
      <div>
        <hr className='border-gray-200' />
        <p className='py-5 text-sm text-center text-gray-500'>Copyright © 2026 Docify - All Right Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

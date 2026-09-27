import type { Metadata } from 'next';
import Image from 'next/image';
import { assets } from '../../assets/assets';

export const metadata: Metadata = {
  title: 'About Us | Healthcare Simplified',
  description: 'Learn more about Docify, our mission to simplify healthcare scheduling, and our commitment to connecting patients with trusted doctors.',
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  return (
    <div>
      <div className='text-center text-2xl pt-10 text-gray-500'>
        <h1 className='text-2xl font-normal text-gray-500'>
          ABOUT <span className='text-gray-700 font-medium'>US</span>
        </h1>
      </div>
      <div className='my-10 flex flex-col md:flex-row gap-12 items-center'>
        <Image 
          className='w-full md:max-w-[360px] rounded-lg h-auto' 
          src={assets.about_image} 
          alt="About Docify Healthcare" 
          priority 
        />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600 leading-relaxed'>
          <p>
            Welcome to Docify, your trusted partner in managing your healthcare needs conveniently and efficiently. At Docify, we understand the challenges individuals face when it comes to scheduling doctor appointments and managing their health records.
          </p>
          <p>
            Docify is committed to excellence in healthcare technology. We continuously strive to enhance our platform, integrating the latest advancements to improve user experience and deliver superior service. Whether you&apos;re booking your first appointment or managing ongoing care, Docify is here to support you every step of the way.
          </p>
          <h2 className='text-gray-800 font-bold text-base'>Our Vision</h2>
          <p>
            Our vision at Docify is to create a seamless healthcare experience for every user. We aim to bridge the gap between patients and healthcare providers, making it easier for you to access the care you need, when you need it.
          </p>
        </div>
      </div>

      <div className='text-xl my-4'>
        <h2 className='text-xl font-normal text-gray-500'>
          WHY <span className='text-gray-700 font-semibold'>CHOOSE US</span>
        </h2>
      </div>
      <div className='flex flex-col md:flex-row mb-20 gap-4 sm:gap-0'>
        <div className='border border-gray-200 px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-indigo-600 hover:text-white transition-all duration-300 text-gray-600 cursor-pointer rounded-sm'>
          <b>Efficiency : </b>
          <p>Streamlined appointment scheduling that fits into your busy lifestyle</p>
        </div>
        <div className='border border-gray-200 px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-indigo-600 hover:text-white transition-all duration-300 text-gray-600 cursor-pointer rounded-sm'>
          <b>Convenience:</b>
          <p>Access to a network of trusted healthcare professionals in your area.</p>
        </div>
        <div className='border border-gray-200 px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-indigo-600 hover:text-white transition-all duration-300 text-gray-600 cursor-pointer rounded-sm'>
          <b>Personalization:</b>
          <p>Tailored recommendations and reminders to help you stay on top of your health.</p>
        </div>
      </div>
    </div>
  );
}

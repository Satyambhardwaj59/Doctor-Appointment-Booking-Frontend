import type { Metadata } from 'next';
import Image from 'next/image';
import { assets } from '../../assets/assets';

export const metadata: Metadata = {
  title: 'Contact Us | Support & Office',
  description: 'Get in touch with Docify healthcare team. Find our office location, phone, email, and career opportunities.',
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactPage() {
  return (
    <div>
      <div className="text-center text-2xl pt-10 text-gray-500">
        <h1 className="text-2xl font-normal text-gray-500">
          CONTACT <span className="text-gray-700 font-medium">US</span>
        </h1>
      </div>
      <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm items-center">
        <Image
          className="w-full md:max-w-[360px] rounded-lg h-auto"
          src={assets.contact_image}
          alt="Contact Docify Office"
          priority
        />
        <div className="flex flex-col justify-center items-start gap-6">
          <h2 className="font-semibold text-lg text-gray-600">Our OFFICE</h2>
          <p className="text-gray-500 leading-relaxed">
            800013 Patliputra <br /> Patna, Bihar, India
          </p>
          <p className="text-gray-500 leading-relaxed">
            Tel: <a href="tel:4155550132" className="hover:text-indigo-600">(415) 555-0132</a> <br />
            Email: <a href="mailto:satyambhardwaj59@gmail.com" className="hover:text-indigo-600">satyambhardwaj59@gmail.com</a>
          </p>
          <h2 className="font-semibold text-lg text-gray-600">
            Careers at Docify
          </h2>
          <p className="text-gray-500">
            Learn more about our teams and job openings.
          </p>
          <button className="border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500 cursor-pointer">
            Explore Jobs
          </button>
        </div>
      </div>
    </div>
  );
}

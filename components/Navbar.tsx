'use client'

import React, { useContext, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import { toast } from 'react-toastify';

const Navbar: React.FC = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { token, setToken, userData } = useContext(AppContext);
    const [showMenu, setShowMenu] = useState(false);

    const logout = () => {
        setToken(false);
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
        }
        toast.success("Logout successfully");
        router.push('/login');
        setShowMenu(false);
    };

    const isActive = (path: string) => {
        if (path === '/') return pathname === '/';
        return pathname.startsWith(path);
    };

    return (
        <header className='flex items-center justify-between text-sm py-4 mb-5 border-b border-gray-400'>
            <Link href='/' className='cursor-pointer'>
                <Image 
                    className='w-44 h-16 object-contain cursor-pointer' 
                    src={assets.logo_one} 
                    alt="Docify Logo" 
                    priority 
                />
            </Link>
            
            <nav aria-label="Main Navigation">
                <ul className='hidden md:flex items-start gap-5 font-medium'>
                    <Link href='/'>
                        <li className='py-1'>HOME</li>
                        <hr className={`border-none outline-none h-0.5 bg-indigo-600 w-3/5 m-auto ${isActive('/') ? 'block' : 'hidden'}`} />
                    </Link>
                    <Link href='/doctors'>
                        <li className='py-1'>ALL DOCTORS</li>
                        <hr className={`border-none outline-none h-0.5 bg-indigo-600 w-3/5 m-auto ${isActive('/doctors') ? 'block' : 'hidden'}`} />
                    </Link>
                    <Link href='/about'>
                        <li className='py-1'>ABOUT</li>
                        <hr className={`border-none outline-none h-0.5 bg-indigo-600 w-3/5 m-auto ${isActive('/about') ? 'block' : 'hidden'}`} />
                    </Link>
                    <Link href='/contact'>
                        <li className='py-1'>CONTACT</li>
                        <hr className={`border-none outline-none h-0.5 bg-indigo-600 w-3/5 m-auto ${isActive('/contact') ? 'block' : 'hidden'}`} />
                    </Link>
                </ul>
            </nav>

            <div className='flex items-center gap-4'>
                {token && userData ? (
                    <div className='flex items-center gap-2 cursor-pointer group relative' tabIndex={0} aria-label="User menu">
                        <img 
                            className='w-8 h-8 rounded-full object-cover' 
                            src={userData.image} 
                            alt={userData.name || "User Avatar"} 
                        />
                        <Image className='w-2.5' src={assets.dropdown_icon} alt="dropdown icon" />
                        <div className='absolute top-10 right-0 text-base font-medium text-gray-600 z-20 hidden group-hover:block group-focus:block'>
                            <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4 shadow-md'>
                                <p onClick={() => router.push('/my-profile')} className='hover:text-black cursor-pointer'>My Profile</p>
                                <p onClick={() => router.push('/my-appointments')} className='hover:text-black cursor-pointer'>My Appointments</p>
                                <p onClick={() => router.push('/my-family')} className='hover:text-black cursor-pointer'>My Family</p>
                                <p onClick={() => router.push('/messages')} className='hover:text-black cursor-pointer'>Messages</p>
                                <p onClick={logout} className='hover:text-black cursor-pointer'>Logout</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <button 
                        onClick={() => router.push('/login')} 
                        className='bg-indigo-600 text-white px-8 py-3 rounded-full font-light hidden md:block cursor-pointer hover:bg-indigo-700 transition-colors'
                    >
                        Create account
                    </button>
                )}

                <button 
                    onClick={() => setShowMenu(true)} 
                    className='md:hidden p-1 focus:outline-none'
                    aria-label="Open mobile navigation menu"
                >
                    <Image className='w-6' src={assets.menu_icon} alt="menu icon" />
                </button>

                {/* ******* Mobile Menu ********** */}
                <div className={`${showMenu ? 'fixed w-full' : 'h-0 w-0'} md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all duration-300`}>
                    <div className='flex items-center justify-between mx-[5%] mt-2'>
                        <Image className='w-36 object-contain' src={assets.logo} alt="Docify Logo" />
                        <button 
                            onClick={() => setShowMenu(false)}
                            aria-label="Close mobile navigation menu"
                            className='p-1'
                        >
                            <Image className='w-7' src={assets.cross_icon} alt="close menu" />
                        </button>
                    </div>
                    <ul className='flex flex-col items-center gap-2 mt-10 px-5 text-lg font-medium'>
                        <Link onClick={() => setShowMenu(false)} href='/' className='w-full text-center'>
                            <p className={`px-4 py-2 rounded inline-block ${pathname === '/' ? 'bg-indigo-600 text-white' : ''}`}>HOME</p>
                        </Link>
                        <Link onClick={() => setShowMenu(false)} href='/doctors' className='w-full text-center'>
                            <p className={`px-4 py-2 rounded inline-block ${pathname.startsWith('/doctors') ? 'bg-indigo-600 text-white' : ''}`}>ALL DOCTORS</p>
                        </Link>
                        <Link onClick={() => setShowMenu(false)} href='/about' className='w-full text-center'>
                            <p className={`px-4 py-2 rounded inline-block ${pathname === '/about' ? 'bg-indigo-600 text-white' : ''}`}>ABOUT</p>
                        </Link>
                        <Link onClick={() => setShowMenu(false)} href='/contact' className='w-full text-center'>
                            <p className={`px-4 py-2 rounded inline-block ${pathname === '/contact' ? 'bg-indigo-600 text-white' : ''}`}>CONTACT</p>
                        </Link>
                        {token && (
                            <>
                                <Link onClick={() => setShowMenu(false)} href='/my-profile' className='w-full text-center'>
                                    <p className={`px-4 py-2 rounded inline-block ${pathname === '/my-profile' ? 'bg-indigo-600 text-white' : ''}`}>My Profile</p>
                                </Link>
                                <Link onClick={() => setShowMenu(false)} href='/my-appointments' className='w-full text-center'>
                                    <p className={`px-4 py-2 rounded inline-block ${pathname === '/my-appointments' ? 'bg-indigo-600 text-white' : ''}`}>My Appointments</p>
                                </Link>
                                <Link onClick={() => setShowMenu(false)} href='/my-family' className='w-full text-center'>
                                    <p className={`px-4 py-2 rounded inline-block ${pathname === '/my-family' ? 'bg-indigo-600 text-white' : ''}`}>My Family</p>
                                </Link>
                                <Link onClick={() => setShowMenu(false)} href='/messages' className='w-full text-center'>
                                    <p className={`px-4 py-2 rounded inline-block ${pathname === '/messages' ? 'bg-indigo-600 text-white' : ''}`}>Messages</p>
                                </Link>
                                <button onClick={logout} className='w-full text-center'>
                                    <p className='px-4 py-2 rounded inline-block text-red-500'>Logout</p>
                                </button>
                            </>
                        )}
                        {!token && (
                            <Link onClick={() => setShowMenu(false)} href='/login' className='w-full text-center'>
                                <p className='px-4 py-2 rounded inline-block text-indigo-600 font-semibold'>Login / Sign Up</p>
                            </Link>
                        )}
                    </ul>
                </div>
            </div>
        </header>
    );
};

export default Navbar;

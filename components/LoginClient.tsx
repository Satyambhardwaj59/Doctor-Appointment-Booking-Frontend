'use client'

import React, { useContext, useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';

const LoginClient: React.FC = () => {
  const { backendUrl, token, setToken } = useContext(AppContext);
  const router = useRouter();

  const [state, setState] = useState<'Sign Up' | 'Login'>('Sign Up');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const onSubmitHandler = async (event: FormEvent) => {
    event.preventDefault();

    try {
      if (state === 'Sign Up') {
        const { data } = await axios.post(`${backendUrl}/api/user/register`, {
          name,
          password,
          email,
        });

        if (data.success) {
          if (typeof window !== 'undefined') {
            localStorage.setItem('token', data.token);
          }
          setToken(data.token);
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/user/login`, {
          password,
          email,
        });

        if (data.success) {
          if (typeof window !== 'undefined') {
            localStorage.setItem('token', data.token);
          }
          setToken(data.token);
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "An error occurred");
    }
  };

  useEffect(() => {
    if (token) {
      router.push('/');
    }
  }, [token, router]);

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center justify-center' aria-label="Authentication form">
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border border-gray-200 rounded-xl text-zinc-600 text-sm shadow-lg bg-white'>
        <h1 className='text-2xl font-semibold text-gray-800'>
          {state === 'Sign Up' ? 'Create Account' : 'Login'}
        </h1>
        <p>Please {state === 'Sign Up' ? 'sign up' : 'log in'} to book appointment</p>

        {state === 'Sign Up' && (
          <div className='w-full'>
            <label htmlFor="name-input" className='block text-gray-700'>Full Name</label>
            <input
              id="name-input"
              className='border border-zinc-300 rounded w-full p-2 mt-1 focus:ring-2 focus:ring-indigo-500 focus:outline-none'
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
          </div>
        )}

        <div className='w-full'>
          <label htmlFor="email-input" className='block text-gray-700'>Email</label>
          <input
            id="email-input"
            className='border border-zinc-300 rounded w-full p-2 mt-1 focus:ring-2 focus:ring-indigo-500 focus:outline-none'
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>

        <div className='w-full'>
          <label htmlFor="password-input" className='block text-gray-700'>Password</label>
          <input
            id="password-input"
            className='border border-zinc-300 rounded w-full p-2 mt-1 focus:ring-2 focus:ring-indigo-500 focus:outline-none'
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
        </div>

        <button
          type='submit'
          className='bg-indigo-600 hover:bg-indigo-700 transition-colors text-white w-full py-2 rounded-md text-base mt-2 cursor-pointer'
        >
          {state === 'Sign Up' ? 'Create Account' : 'Login'}
        </button>

        {state === 'Sign Up' ? (
          <p>
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => setState('Login')}
              className='text-indigo-600 underline cursor-pointer hover:text-indigo-800'
            >
              Login here
            </button>
          </p>
        ) : (
          <p>
            Create a new account?{' '}
            <button
              type="button"
              onClick={() => setState('Sign Up')}
              className='text-indigo-600 underline cursor-pointer hover:text-indigo-800'
            >
              click here
            </button>
          </p>
        )}
      </div>
    </form>
  );
};

export default LoginClient;

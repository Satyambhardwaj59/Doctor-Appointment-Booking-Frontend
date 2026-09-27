'use client'

import React, { useState, useContext, ChangeEvent } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import { UserData } from '../types';

const MyProfileClient: React.FC = () => {
  const router = useRouter();
  const { userData, setUserData, backendUrl, token, loadUserProfileData } = useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState<File | false>(false);

  const updateUserProfileData = async () => {
    if (!userData) return;

    try {
      const formData = new FormData();

      formData.append('name', userData.name);
      formData.append('phone', userData.phone);
      formData.append('gender', userData.gender);
      formData.append('address', JSON.stringify(userData.address));
      formData.append('dob', userData.dob);

      if (image) {
        formData.append('image', image);
      }

      const { data } = await axios.post(`${backendUrl}/api/user/update-profile`, formData, {
        headers: { token: token as string },
      });

      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setImage(false);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to update profile");
    }
  };

  if (!userData) {
    return (
      <div className='min-h-[50vh] flex items-center justify-center'>
        <p className='text-gray-500'>Please login to view your profile.</p>
      </div>
    );
  }

  return (
    <div className='max-w-lg flex flex-col gap-2 text-sm'>
      {isEdit ? (
        <label htmlFor="image" className='cursor-pointer inline-block'>
          <div className='inline-block relative cursor-pointer'>
            <img
              className='w-36 rounded opacity-60 object-cover aspect-square'
              src={image ? URL.createObjectURL(image) : userData.image}
              alt="Profile avatar preview"
            />
            {!image && (
              <Image className='w-10 absolute bottom-12 right-12' src={assets.upload_icon} alt="upload icon" />
            )}
          </div>
          <input
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              if (e.target.files && e.target.files[0]) {
                setImage(e.target.files[0]);
              }
            }}
            type="file"
            id='image'
            accept="image/*"
            hidden
          />
        </label>
      ) : (
        <img className='w-36 rounded object-cover aspect-square' src={userData.image} alt="User profile" />
      )}

      {isEdit ? (
        <input
          className='bg-gray-100 text-3xl font-medium max-w-60 mt-4 px-2 py-1 rounded border border-gray-300'
          type="text"
          value={userData.name}
          onChange={(e) =>
            setUserData((prev) => (prev ? { ...prev, name: e.target.value } : prev))
          }
        />
      ) : (
        <h1 className='font-medium text-3xl text-neutral-800 mt-4'>{userData.name}</h1>
      )}

      <hr className='bg-zinc-400 h-[1px] border-none my-2' />

      <div>
        <p className='text-neutral-500 underline mt-3 uppercase tracking-wider font-semibold text-xs'>
          Contact Information
        </p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700 items-center'>
          <p className='font-medium'>Email id:</p>
          <p className='text-blue-500'>{userData.email}</p>
          <p className='font-medium'>Phone:</p>
          {isEdit ? (
            <input
              className='bg-gray-100 max-w-52 px-2 py-1 rounded border border-gray-300'
              type="text"
              value={userData.phone}
              onChange={(e) =>
                setUserData((prev) => (prev ? { ...prev, phone: e.target.value } : prev))
              }
            />
          ) : (
            <p className='text-blue-500'>{userData.phone}</p>
          )}
          <p className='font-medium'>Address:</p>
          {isEdit ? (
            <div>
              <input
                className='bg-gray-100 w-full px-2 py-1 rounded border border-gray-300 mb-1'
                onChange={(e) =>
                  setUserData((prev) =>
                    prev ? { ...prev, address: { ...prev.address, line1: e.target.value } } : prev
                  )
                }
                value={userData.address.line1}
                type="text"
              />
              <input
                className='bg-gray-100 w-full px-2 py-1 rounded border border-gray-300'
                onChange={(e) =>
                  setUserData((prev) =>
                    prev ? { ...prev, address: { ...prev.address, line2: e.target.value } } : prev
                  )
                }
                value={userData.address.line2}
                type="text"
              />
            </div>
          ) : (
            <p className='text-gray-500'>
              {userData.address.line1}
              <br />
              {userData.address.line2}
            </p>
          )}
        </div>
      </div>

      <div>
        <p className='text-neutral-500 underline mt-3 uppercase tracking-wider font-semibold text-xs'>
          Basic Information
        </p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700 items-center'>
          <p className='font-medium'>Gender:</p>
          {isEdit ? (
            <select
              className='max-w-28 bg-gray-100 px-2 py-1 rounded border border-gray-300'
              onChange={(e) =>
                setUserData((prev) => (prev ? { ...prev, gender: e.target.value } : prev))
              }
              value={userData.gender}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          ) : (
            <p className='text-gray-400'>{userData.gender}</p>
          )}
          <p className='font-medium'>Birthday:</p>
          {isEdit ? (
            <input
              className='max-w-36 bg-gray-100 px-2 py-1 rounded border border-gray-300'
              type="date"
              onChange={(e) =>
                setUserData((prev) => (prev ? { ...prev, dob: e.target.value } : prev))
              }
              value={userData.dob}
            />
          ) : (
            <p className='text-gray-400'>{userData.dob}</p>
          )}
        </div>
      </div>

      {/* Family Accounts Section */}
      <div className='mt-8 pt-6 border-t border-gray-200'>
        <p className='text-neutral-500 uppercase tracking-wider font-semibold text-xs'>
          Family Accounts
        </p>
        <div className='mt-3 p-4 bg-indigo-50/70 rounded-2xl border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3'>
          <div>
            <h3 className='font-semibold text-gray-900 text-sm'>Manage Family Members</h3>
            <p className='text-xs text-gray-500 mt-0.5'>
              Add dependents, children, or parents to book appointments on their behalf.
            </p>
          </div>
          <button
            type='button'
            onClick={() => router.push('/my-family')}
            className='self-start sm:self-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-xs font-medium transition-colors cursor-pointer whitespace-nowrap'
          >
            Go to My Family
          </button>
        </div>
      </div>

      <div className='mt-10'>
        {isEdit ? (
          <button
            className='border border-indigo-600 px-8 py-2 rounded-full hover:bg-indigo-600 hover:text-white transition-all duration-500 cursor-pointer'
            onClick={updateUserProfileData}
          >
            Save information
          </button>
        ) : (
          <button
            className='border border-indigo-600 px-8 py-2 rounded-full hover:bg-indigo-600 hover:text-white transition-all duration-500 cursor-pointer'
            onClick={() => setIsEdit(true)}
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default MyProfileClient;

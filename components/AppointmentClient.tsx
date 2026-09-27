'use client'

import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import RelatedDoctors from './RelatedDoctors';
import { Doctor } from '../types';
import {
  FamilySwitcher,
  useFamilyMembers,
  useFamilySwitcher,
  SELF_OPTION,
} from '../features/family-accounts';

interface SlotItem {
  datetime: Date;
  time: string;
}

interface AppointmentClientProps {
  docId: string;
}

const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const AppointmentClient: React.FC<AppointmentClientProps> = ({ docId }) => {
  const router = useRouter();
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext);
  const { familyMembers } = useFamilyMembers({ enabled: !!token });
  const { selectedId: familySelection, setSelectedId: setFamilySelection } =
    useFamilySwitcher(familyMembers);

  const [docInfo, setDocInfo] = useState<Doctor | null>(null);
  const [docSlots, setDocSlots] = useState<SlotItem[][]>([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState('');

  const fetchDocInfo = async () => {
    const foundDoc = doctors.find((doc) => doc._id === docId);
    if (foundDoc) {
      setDocInfo(foundDoc);
    }
  };

  const getAvailableSlots = async () => {
    if (!docInfo) return;
    setDocSlots([]);

    const today = new Date();
    const allSlots: SlotItem[][] = [];

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      const endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10);
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      const timeSlots: SlotItem[] = [];

      while (currentDate < endTime) {
        const formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();

        const slotDate = `${day}_${month}_${year}`;

        const isBooked = docInfo.slots_booked?.[slotDate]?.includes(formattedTime);

        if (!isBooked) {
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime,
          });
        }

        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      allSlots.push(timeSlots);
    }

    setDocSlots(allSlots);
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warn("Login to book appointment");
      router.push('/login');
      return;
    }

    if (!slotTime) {
      toast.warn("Please select a time slot");
      return;
    }

    try {
      if (!docSlots[slotIndex] || docSlots[slotIndex].length === 0) {
        toast.error("No slots available for this day");
        return;
      }

      const date = docSlots[slotIndex][0].datetime;
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      const slotDate = `${day}_${month}_${year}`;

      const { data } = await axios.post(
        `${backendUrl}/api/user/book-appointment`,
        {
          docId,
          slotDate,
          slotTime,
          familyMemberId: familySelection !== SELF_OPTION ? familySelection : undefined,
        },
        { headers: { token: token as string } }
      );

      if (data.success) {
        toast.success(data.message);
        await getDoctorsData();
        router.push('/my-appointments');
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to book appointment");
    }
  };

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    getAvailableSlots();
  }, [docInfo]);

  if (!docInfo) return null;

  const docImgSrc = typeof docInfo.image === 'string' ? docInfo.image : (docInfo.image as any)?.src || '';

  return (
    <div>
      {/* *********** Doctors Details ************* */}
      <div className='flex flex-col sm:flex-row gap-4'>
        <div>
          <img 
            className='bg-indigo-600 w-full sm:max-w-72 rounded-lg object-cover' 
            src={docImgSrc} 
            alt={`Dr. ${docInfo.name}`} 
          />
        </div>

        <div className='flex-1 border border-gray-400 p-8 py-7 rounded-lg bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
          {/* ******** Doc Info : name, degree, experience ****** */}
          <h1 className='flex items-center gap-2 text-2xl font-medium text-gray-900'>
            {docInfo.name}
            <Image className='w-5 h-auto' src={assets.verified_icon} alt="Verified Doctor" />
          </h1>
          <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
            <p>{docInfo.degree} - {docInfo.speciality}</p>
            <span className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</span>
          </div>

          {/* ******* Doctor About ********** */}
          <div>
            <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>
              About <Image className='w-4 h-auto' src={assets.info_icon} alt="information icon" />
            </p>
            <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo.about}</p>
          </div>

          {/* ******* Appointment fee ******* */}
          <p className='text-gray-500 font-medium mt-4'>
            Appointment fee : <span className='text-gray-600'>{currencySymbol} {docInfo.fees}</span>
          </p>
        </div>
      </div>

      {/* ******** Booking Slots *********** */}
      <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
        {token && (
          <div className='mb-4'>
            {familyMembers.length > 0 ? (
              <div className='flex flex-col gap-1.5'>
                <FamilySwitcher
                  familyMembers={familyMembers}
                  selectedId={familySelection}
                  onChange={setFamilySelection}
                />
                <div className='text-xs text-gray-500 flex items-center gap-1 -mt-2 mb-2'>
                  <span>Need to add or edit members?</span>
                  <button
                    type="button"
                    onClick={() => router.push('/my-family')}
                    className='text-indigo-600 font-medium hover:underline cursor-pointer'
                  >
                    Manage family
                  </button>
                </div>
              </div>
            ) : (
              <div className='text-xs text-gray-600 p-3 bg-indigo-50/70 rounded-xl border border-indigo-100 flex items-center justify-between gap-2'>
                <span>Booking for a family member? Add them to book on their behalf.</span>
                <button
                  type="button"
                  onClick={() => router.push('/my-family')}
                  className='text-indigo-600 font-semibold hover:underline whitespace-nowrap cursor-pointer'
                >
                  + Add family member
                </button>
              </div>
            )}
          </div>
        )}
        <p>Booking slots</p>
        <div className='flex gap-3 items-center w-full overflow-x-auto mt-4 pb-2'>
          {docSlots.length > 0 &&
            docSlots.map((item, index) => (
              <div
                onClick={() => setSlotIndex(index)}
                className={`text-center py-6 min-w-16 rounded-full cursor-pointer transition-colors ${
                  slotIndex === index ? 'bg-indigo-600 text-white' : 'border border-gray-200'
                }`}
                key={index}
                role="button"
                tabIndex={0}
                aria-label={`Select date ${item[0] ? daysOfWeek[item[0].datetime.getDay()] + ' ' + item[0].datetime.getDate() : ''}`}
              >
                <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                <p>{item[0] && item[0].datetime.getDate()}</p>
              </div>
            ))}
        </div>

        <div className='flex gap-3 items-center w-full overflow-x-auto mt-4 pb-2'>
          {docSlots.length > 0 &&
            docSlots[slotIndex]?.map((item, index) => (
              <p
                onClick={() => setSlotTime(item.time)}
                className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer transition-colors ${
                  item.time === slotTime ? 'bg-indigo-600 text-white' : 'border border-gray-200'
                }`}
                key={index}
                role="button"
                tabIndex={0}
              >
                {item.time.toLowerCase()}
              </p>
            ))}
        </div>

        <button
          onClick={bookAppointment}
          className='bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-light px-14 py-3 rounded-full my-6 cursor-pointer transition-colors'
        >
          Book an appointment
        </button>
      </div>

      {/* ******* Listing Related Doctors */}
      <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
    </div>
  );
};

export default AppointmentClient;

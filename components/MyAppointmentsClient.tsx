'use client'

import React, { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';
import { Appointment } from '../types';
import { createConsultation } from '../features/video-consultation/services/videoConsultation.service';
import { relationshipLabel } from '../features/family-accounts';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const months = [' ', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const MyAppointmentsClient: React.FC = () => {
  const { backendUrl, token, getDoctorsData } = useContext(AppContext);
  const router = useRouter();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [joiningVideoId, setJoiningVideoId] = useState<string | null>(null);

  const slotDateFormat = (slotDate: string) => {
    const dateArray = slotDate.split('_');
    return `${dateArray[0]} ${months[Number(dateArray[1])]} ${dateArray[2]}`;
  };

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appointments`, {
        headers: { token: token as string },
      });
      if (data.success) {
        setAppointments(data.appointments.reverse());
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to load appointments");
    }
  };

  const cancelAppointment = async (appointmentId: string) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/cancel-appointment`,
        { appointmentId },
        { headers: { token: token as string } }
      );

      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
        getDoctorsData();
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to cancel appointment");
    }
  };

  const initPay = (order: any) => {
    const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_Gi9qoGkmGD8F0P";

    const options = {
      key: razorpayKey,
      amount: order.amount,
      currency: order.currency,
      name: 'Appointment Payment',
      description: 'Appointment Payment',
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response: any) => {
        try {
          const { data } = await axios.post(
            `${backendUrl}/api/user/verifyRazorpay`,
            response,
            { headers: { token: token as string } }
          );
          if (data.success) {
            getUserAppointments();
            router.push('/my-appointments');
          }
        } catch (error: any) {
          console.error(error);
          toast.error(error.message || "Payment verification failed");
        }
      },
    };

    if (typeof window !== 'undefined' && window.Razorpay) {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } else {
      toast.error("Razorpay SDK is loading, please try again in a moment");
    }
  };

  const appointmentRazorpay = async (appointmentId: string) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/payment-razorpay`,
        { appointmentId },
        { headers: { token: token as string } }
      );

      if (data.success) {
        initPay(data.order);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Payment initiation failed");
    }
  };

  const handleJoinVideo = async (appointmentId: string) => {
    try {
      setJoiningVideoId(appointmentId);
      const data = await createConsultation(appointmentId);
      if (data.success && data.consultation) {
        router.push(`/video-consultation/${data.consultation._id}/waiting-room`);
      } else {
        toast.error(data.message || 'Unable to start video consultation');
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message || 'Error initiating video call');
    } finally {
      setJoiningVideoId(null);
    }
  };

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);

  return (
    <div>
      <div className='flex items-center justify-between pb-3 mt-12 border-b'>
        <h1 className='font-medium text-zinc-700 text-lg'>My appointments</h1>
        <button
          onClick={() => router.push('/video-consultation/history')}
          className='text-xs sm:text-sm font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3.5 py-1.5 rounded-full transition flex items-center gap-1.5'
        >
          <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' />
          </svg>
          Video Consultations
        </button>
      </div>
      <div>
        {appointments.map((item, index) => {
          const docImg = typeof item.docData.image === 'string' ? item.docData.image : (item.docData.image as any)?.src || '';
          return (
            <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b' key={index}>
              <div>
                <img className='w-32 bg-indigo-100 rounded-lg object-cover aspect-square' src={docImg} alt={item.docData.name} />
              </div>
              <div className='flex-1 text-sm text-zinc-600'>
                <p className='text-neutral-800 font-semibold text-base'>{item.docData.name}</p>
                <p>{item.docData.speciality}</p>
                {item.familyMemberData && (
                  <span className='inline-block mt-1 text-xs font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full'>
                    For: {item.familyMemberData.name} ({relationshipLabel(item.familyMemberData.relationship)})
                  </span>
                )}
                <p className='text-zinc-700 font-medium mt-1'>Address:</p>
                <p className='text-xs'>{item.docData.address?.line1}</p>
                <p className='text-xs'>{item.docData.address?.line2}</p>
                <p className='text-xs mt-1'>
                  <span className='text-sm text-neutral-700 font-medium'>Date & Time:</span>{' '}
                  {slotDateFormat(item.slotDate)} | {item.slotTime}
                </p>
              </div>
              <div></div>
              <div className='flex flex-col gap-2 justify-end'>
                {!item.cancelled && (
                  <button
                    onClick={() => router.push(`/messages?doctorId=${item.docData._id}`)}
                    className='text-sm text-indigo-600 text-center sm:min-w-48 py-2 border border-indigo-200 rounded-full cursor-pointer hover:bg-indigo-600 hover:text-white transition-all duration-300 flex items-center justify-center gap-2'
                  >
                    💬 Chat with Doctor
                  </button>
                )}
                {!item.cancelled && !item.isCompleted && (
                  <button
                    disabled={joiningVideoId === item._id}
                    onClick={() => handleJoinVideo(item._id)}
                    className='text-sm text-white font-medium text-center sm:min-w-48 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-full cursor-pointer shadow-sm hover:shadow transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-75'
                  >
                    {joiningVideoId === item._id ? (
                      <span className='inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                    ) : (
                      <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' />
                      </svg>
                    )}
                    Video Consultation
                  </button>
                )}
                {!item.cancelled && item.payment && !item.isCompleted && (
                  <button className='sm:min-w-48 py-2 border rounded-full text-stone-500 bg-indigo-100 font-medium'>
                    Paid
                  </button>
                )}
                {!item.cancelled && !item.payment && !item.isCompleted && (
                  <button
                    onClick={() => appointmentRazorpay(item._id)}
                    className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded-full cursor-pointer hover:bg-indigo-600 hover:text-white transition-all duration-300'
                  >
                    Pay online
                  </button>
                )}
                {!item.cancelled && !item.isCompleted && (
                  <button
                    onClick={() => cancelAppointment(item._id)}
                    className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded-full cursor-pointer hover:bg-red-600 hover:text-white transition-all duration-300'
                  >
                    Cancel appointment
                  </button>
                )}
                {item.cancelled && !item.isCompleted && (
                  <button className='sm:min-w-48 py-2 border border-red-500 text-red-500 rounded-full cursor-default'>
                    Appointment cancelled
                  </button>
                )}
                {item.isCompleted && (
                  <button className='sm:min-w-48 py-2 border border-green-500 text-green-500 rounded-full cursor-default'>
                    Completed
                  </button>
                )}
              </div>
            </div>
          );
        })}
        {appointments.length === 0 && (
          <p className='text-gray-500 py-8 text-center'>No appointments booked yet.</p>
        )}
      </div>
    </div>
  );
};

export default MyAppointmentsClient;

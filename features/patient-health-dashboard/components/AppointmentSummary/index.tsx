import React from 'react';
import SectionCard from '../SectionCard';
import { formatSlotDate } from '../../utils/patientDashboard.utils';
import type { UpcomingAppointment } from '../../types/patientDashboard.types';

interface AppointmentSummaryProps {
  appointment: UpcomingAppointment | null;
  upcomingCount: number;
  error?: string;
  onView: () => void;
  onBook: () => void;
}

const AppointmentSummary: React.FC<AppointmentSummaryProps> = ({ appointment, upcomingCount, error, onView, onBook }) => (
  <SectionCard title="Upcoming Appointment" icon="📅" actionLabel="View all" onAction={onView} error={error}>
    {appointment ? (
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {appointment.doctor.image ? (
              <img src={appointment.doctor.image} alt="" className="w-12 h-12 rounded-full object-cover bg-indigo-50" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-semibold shrink-0">
                {appointment.doctor.name.charAt(0)}
              </div>
            )}
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 truncate">{appointment.doctor.name}</p>
              <p className="text-xs text-gray-500 truncate">{appointment.doctor.speciality}</p>
            </div>
          </div>
          <span
            className={`text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0 ${
              appointment.isToday ? 'bg-green-50 text-green-700' : 'bg-indigo-50 text-indigo-700'
            }`}
          >
            {appointment.isToday ? 'Today' : 'Upcoming'}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl bg-gray-50 px-3 py-2">
            <p className="text-[11px] text-gray-400">Date</p>
            <p className="font-medium text-gray-800">{formatSlotDate(appointment.slotDate)}</p>
          </div>
          <div className="rounded-xl bg-gray-50 px-3 py-2">
            <p className="text-[11px] text-gray-400">Time</p>
            <p className="font-medium text-gray-800">{appointment.slotTime}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <span className={`text-xs ${appointment.payment ? 'text-green-600' : 'text-gray-400'}`}>
            {appointment.payment ? '✓ Payment complete' : 'Payment pending'}
          </span>
          {upcomingCount > 1 && <span className="text-xs text-gray-400">+{upcomingCount - 1} more upcoming</span>}
        </div>
      </div>
    ) : (
      <div className="text-center py-6">
        <p className="text-sm font-medium text-gray-700">No upcoming appointments</p>
        <button
          onClick={onBook}
          className="mt-3 px-4 py-2 rounded-full text-sm bg-indigo-600 text-white hover:bg-indigo-700"
        >
          Book an appointment
        </button>
      </div>
    )}
  </SectionCard>
);

export default AppointmentSummary;

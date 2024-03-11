import React, { useEffect, useState } from 'react';
import {
  fetchClients,
  createAppointment,
  fetchAppointments,
  Client,
  Appointment,
} from '../api';
import DateTimePicker from './DateTimePicker';

interface NewAppointmentFormProps {
  onCreated: () => void;
}

const Toast: React.FC<{
  message: string;
  show: boolean;
  onClose: () => void;
}> = ({ message, show, onClose }) => {
  if (!show) return null;
  return (
    <div className='fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50'>
      <div className='bg-purple-600 text-white px-6 py-3 rounded shadow-lg flex items-center gap-2 animate-fadeInUp'>
        <svg
          className='w-5 h-5'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M5 13l4 4L19 7'
          />
        </svg>
        <span>{message}</span>
        <button
          onClick={onClose}
          className='ml-2 text-white hover:text-gray-200'
        >
          &times;
        </button>
      </div>
    </div>
  );
};

const NewAppointmentForm: React.FC<NewAppointmentFormProps> = ({
  onCreated,
}) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [clientId, setClientId] = useState<number>();
  const [scheduledAt, setScheduledAt] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string | null>(null);
  const [toast, setToast] = useState<{ show: boolean; message: string }>({
    show: false,
    message: '',
  });
  const [bookedTimes, setBookedTimes] = useState<Date[]>([]);
  const [selectedDateOnly, setSelectedDateOnly] = useState<string | null>(null);

  useEffect(() => {
    fetchClients().then(setClients);
  }, []);

  // Load booked times for the visible/selected day (default to today on first open)
  useEffect(() => {
    const loadBookedTimes = async () => {
      const base = scheduledAt ? new Date(scheduledAt) : new Date();
      const day = new Date(base.getFullYear(), base.getMonth(), base.getDate());
      const start = new Date(
        day.getFullYear(),
        day.getMonth(),
        day.getDate(),
        0,
        0,
        0
      );
      const end = new Date(
        day.getFullYear(),
        day.getMonth(),
        day.getDate(),
        23,
        59,
        59
      );
      const appts: Appointment[] = await fetchAppointments(1, 500);
      const sameDay = appts.filter((a) => {
        const d = new Date(a.scheduled_at);
        return d >= start && d <= end;
      });
      setBookedTimes(sameDay.map((a) => new Date(a.scheduled_at)));
      setSelectedDateOnly(
        `${day.getFullYear()}-${day.getMonth()}-${day.getDate()}`
      );
    };
    loadBookedTimes();
  }, [scheduledAt]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || !scheduledAt) {
      setErrors('Client and date/time are required.');
      return;
    }
    setLoading(true);
    try {
      await createAppointment({
        client_id: clientId,
        scheduled_at: scheduledAt,
        notes,
      });
    } catch (e: any) {
      setLoading(false);
      setErrors(
        e.message?.includes('has already been taken')
          ? 'This time slot is already booked. Please choose a different time.'
          : e.message || 'Failed to create appointment'
      );
      return;
    }
    setErrors(null);
    setClientId(undefined);
    setScheduledAt('');
    setNotes('');
    setLoading(false);
    setToast({ show: true, message: 'Appointment created!' });
    onCreated();
  };

  return (
    <section className='bg-white rounded-xl shadow-md p-6 border border-gray-100 mb-8 max-w-xl mx-auto animate-fadeInUp'>
      <h2 className='text-xl font-bold mb-4 text-purple-700 flex items-center gap-2'>
        <svg
          className='w-6 h-6 text-purple-400'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M12 4v16m8-8H4'
          />
        </svg>
        New Appointment
      </h2>
      <form onSubmit={handleSubmit}>
        {errors && (
          <div className='mb-3 px-3 py-2 rounded bg-red-50 border border-red-200 text-red-700'>
            {errors}
          </div>
        )}
        <div className='mb-4'>
          <label className='block text-gray-700 mb-1 flex items-center gap-1'>
            <svg
              className='w-4 h-4 text-blue-400'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z'
              />
            </svg>
            Client
          </label>
          <select
            value={clientId || ''}
            onChange={(e) => setClientId(Number(e.target.value))}
            required
            className='w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400'
            aria-label='Select client'
          >
            <option value='' disabled>
              Select client
            </option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>
        <div className='mb-4'>
          <label className='block text-gray-700 mb-1 flex items-center gap-1'>
            <svg
              className='w-4 h-4 text-green-400'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
              />
            </svg>
            Date & Time
          </label>
          <DateTimePicker
            value={scheduledAt}
            onChange={(val) => setScheduledAt(val)}
            ariaLabel='Appointment date and time'
            excludeTimes={bookedTimes}
            filterTime={(d) => {
              if (!selectedDateOnly) return true;
              const cur = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
              if (cur !== selectedDateOnly) return true;
              return !bookedTimes.some(
                (t) =>
                  t.getHours() === d.getHours() &&
                  t.getMinutes() === d.getMinutes()
              );
            }}
          />
        </div>
        <div className='mb-4'>
          <label className='block text-gray-700 mb-1 flex items-center gap-1'>
            <svg
              className='w-4 h-4 text-gray-400'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8a9 9 0 1118 0z'
              />
            </svg>
            Notes
          </label>
          <textarea
            placeholder='Notes'
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className='w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400'
            aria-label='Appointment notes'
          />
        </div>
        <button
          type='submit'
          className='bg-purple-600 text-white px-6 py-2 rounded font-semibold shadow hover:bg-purple-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:opacity-60 flex items-center gap-2'
          disabled={loading}
        >
          <svg
            className='w-5 h-5'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M12 4v16m8-8H4'
            />
          </svg>
          {loading ? 'Creating...' : 'Create Appointment'}
        </button>
      </form>
      <Toast
        message={toast.message}
        show={toast.show}
        onClose={() => setToast({ show: false, message: '' })}
      />
    </section>
  );
};

export default NewAppointmentForm;

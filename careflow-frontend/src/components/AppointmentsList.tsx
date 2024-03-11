import React, { useEffect, useState } from 'react';
import {
  fetchAppointments,
  updateAppointment,
  deleteAppointment,
  Appointment,
  fetchClients,
  Client,
} from '../api';
import DateTimePicker from './DateTimePicker';

const EditModal: React.FC<{
  open: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  clients: Client[];
  onSave: (data: Partial<Appointment>) => void;
}> = ({ open, onClose, appointment, clients, onSave }) => {
  const [clientId, setClientId] = useState<number | undefined>(
    appointment?.client_id
  );
  const [scheduledAt, setScheduledAt] = useState(
    appointment?.scheduled_at || ''
  );
  const [notes, setNotes] = useState(appointment?.notes || '');

  useEffect(() => {
    setClientId(appointment?.client_id);
    setScheduledAt(appointment?.scheduled_at || '');
    setNotes(appointment?.notes || '');
  }, [appointment]);

  if (!open || !appointment) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 animate-fadeIn'>
      <div className='bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative animate-fadeInUp'>
        <button
          onClick={onClose}
          className='absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl'
          aria-label='Close'
        >
          &times;
        </button>
        <h3 className='text-lg font-bold mb-4 text-purple-700'>
          Edit Appointment
        </h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave({ client_id: clientId, scheduled_at: scheduledAt, notes });
          }}
        >
          <div className='mb-3'>
            <label className='block text-gray-700 mb-1'>Client</label>
            <select
              value={clientId || ''}
              onChange={(e) => setClientId(Number(e.target.value))}
              required
              className='w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400'
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
          <div className='mb-3'>
            <label className='block text-gray-700 mb-1'>Date & Time</label>
            <DateTimePicker
              value={scheduledAt}
              onChange={setScheduledAt}
              ariaLabel='Edit appointment date and time'
            />
          </div>
          <div className='mb-3'>
            <label className='block text-gray-700 mb-1'>Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className='w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400'
            />
          </div>
          <div className='flex justify-end gap-2 mt-4'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700 font-semibold shadow transition'
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ConfirmModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}> = ({ open, onClose, onConfirm }) => {
  if (!open) return null;
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 animate-fadeIn'>
      <div className='bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm relative animate-fadeInUp flex flex-col items-center'>
        <div className='bg-red-100 rounded-full p-3 mb-3'>
          <svg
            className='w-8 h-8 text-red-600'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M6 18L18 6M6 6l12 12'
            />
          </svg>
        </div>
        <h3 className='text-lg font-bold mb-2 text-red-600'>
          Cancel Appointment
        </h3>
        <p className='mb-6 text-gray-700 text-center'>
          Are you sure you want to cancel this appointment?
        </p>
        <div className='flex justify-end gap-2 w-full'>
          <button
            onClick={onClose}
            className='px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition'
          >
            Keep
          </button>
          <button
            onClick={onConfirm}
            className='px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 font-semibold shadow transition flex items-center gap-1'
          >
            <svg
              className='w-4 h-4'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const Toast: React.FC<{
  message: string;
  show: boolean;
  onClose: () => void;
}> = ({ message, show, onClose }) => {
  if (!show) return null;
  return (
    <div className='fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50'>
      <div className='bg-green-600 text-white px-6 py-3 rounded shadow-lg flex items-center gap-2 animate-fadeInUp'>
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

const AppointmentsList: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [editModal, setEditModal] = useState<{
    open: boolean;
    appointment: Appointment | null;
  }>({ open: false, appointment: null });
  const [page, setPage] = useState(1);
  const perPage = 10;
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    id: number | null;
  }>({ open: false, id: null });
  const [toast, setToast] = useState<{ show: boolean; message: string }>({
    show: false,
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [apps, cls] = await Promise.all([
        fetchAppointments(page, perPage),
        fetchClients(1, 100),
      ]);
      setAppointments(apps);
      setClients(cls);
    } catch (e: any) {
      setToast({ show: true, message: e.message || 'Failed to load data' });
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [page]);

  const handleEdit = (appointment: Appointment) =>
    setEditModal({ open: true, appointment });
  const handleDelete = (id: number) => setConfirmModal({ open: true, id });
  const confirmDelete = async () => {
    if (confirmModal.id) {
      try {
        await deleteAppointment(confirmModal.id);
        setConfirmModal({ open: false, id: null });
        setToast({ show: true, message: 'Appointment cancelled!' });
        load();
      } catch (e: any) {
        setToast({ show: true, message: e.message || 'Failed to cancel' });
      }
    }
  };
  const handleSave = async (data: Partial<Appointment>) => {
    if (editModal.appointment) {
      try {
        await updateAppointment(editModal.appointment.id, data);
        setEditModal({ open: false, appointment: null });
        setToast({ show: true, message: 'Appointment updated!' });
        load();
      } catch (e: any) {
        setToast({ show: true, message: e.message || 'Update failed' });
      }
    }
  };

  return (
    <section className='mb-8'>
      <h2 className='text-2xl font-bold mb-4 text-green-700'>
        Upcoming Appointments
      </h2>
      {loading ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn'>
          {[1, 2, 3, 4].map((k) => (
            <div
              key={k}
              className='bg-white rounded-2xl shadow-md p-4 border border-gray-100'
            >
              <div className='h-4 w-1/2 bg-gray-100 rounded mb-3 animate-pulse' />
              <div className='h-3 w-2/3 bg-gray-100 rounded mb-2 animate-pulse' />
              <div className='h-3 w-full bg-gray-100 rounded mb-3 animate-pulse' />
              <div className='h-8 w-24 bg-gray-100 rounded animate-pulse' />
            </div>
          ))}
        </div>
      ) : appointments.length === 0 ? (
        <div className='text-center text-gray-600 bg-white border border-dashed border-gray-300 rounded-2xl p-10 animate-fadeIn'>
          <div className='mx-auto mb-3 w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center'>
            <svg
              className='w-6 h-6'
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
          </div>
          <div className='font-semibold text-gray-800 mb-1'>
            No appointments yet
          </div>
          <p className='text-sm text-gray-500 mb-4'>
            Get started by creating your first appointment.
          </p>
          <a
            href='/new-appointment'
            className='inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow'
          >
            <svg
              className='w-4 h-4'
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
          </a>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          {appointments.map((app) => (
            <div
              key={app.id}
              className='bg-white rounded-2xl shadow-md p-4 border border-gray-100 hover:shadow-2xl hover:scale-[1.02] transition-all duration-200 hover:border-green-400 relative group animate-fadeInUp'
              tabIndex={0}
              aria-label={`Appointment for ${app.client?.name}`}
            >
              <div className='flex items-center justify-between mb-2'>
                <div className='font-semibold text-lg text-gray-800 flex items-center gap-2'>
                  <span className='inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-50 text-green-600 border border-green-100'>
                    <svg
                      className='w-4 h-4'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M12 8v4l3 3'
                      />
                    </svg>
                  </span>
                  {app.client?.name}
                </div>
                <span className='text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100'>
                  Upcoming
                </span>
              </div>
              <div className='text-gray-600 text-sm mb-2 flex items-center gap-2'>
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
                    d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                  />
                </svg>
                {new Date(app.scheduled_at).toLocaleString(undefined, {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </div>
              <div className='text-gray-600 text-sm mb-2 break-words whitespace-pre-line flex items-start gap-2'>
                <svg
                  className='w-4 h-4 mt-1 text-gray-400'
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
                <span className='text-gray-700 break-words'>
                  {app.notes || 'No notes provided.'}
                </span>
              </div>
              <div className='absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                <button
                  onClick={() => handleEdit(app)}
                  className='bg-blue-500 text-white rounded px-2 py-1 text-xs hover:bg-blue-600 shadow flex items-center gap-1'
                  title='Edit'
                >
                  <svg
                    className='w-4 h-4'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M15.232 5.232l3.536 3.536M9 11l6 6M3 21h6v-6H3v6z'
                    />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(app.id)}
                  className='bg-red-500 text-white rounded px-2 py-1 text-xs hover:bg-red-600 shadow flex items-center gap-1'
                  title='Cancel'
                >
                  <svg
                    className='w-4 h-4'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M6 18L18 6M6 6l12 12'
                    />
                  </svg>
                  Cancel
                </button>
              </div>
              <div className='mt-3 flex justify-end'>
                <button
                  onClick={() => handleEdit(app)}
                  className='inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100 transition'
                >
                  <svg
                    className='w-4 h-4'
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
                  Reschedule
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className='mt-4 flex items-center justify-between'>
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className='px-3 py-1.5 rounded border border-gray-200 bg-white disabled:opacity-50'
        >
          Previous
        </button>
        <div className='text-sm text-gray-500'>Page {page}</div>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={appointments.length < perPage}
          className='px-3 py-1.5 rounded border border-gray-200 bg-white disabled:opacity-50'
        >
          Next
        </button>
      </div>
      <EditModal
        open={editModal.open}
        onClose={() => setEditModal({ open: false, appointment: null })}
        appointment={editModal.appointment}
        clients={clients}
        onSave={handleSave}
      />
      <ConfirmModal
        open={confirmModal.open}
        onClose={() => setConfirmModal({ open: false, id: null })}
        onConfirm={confirmDelete}
      />
      <Toast
        message={toast.message}
        show={toast.show}
        onClose={() => setToast({ show: false, message: '' })}
      />
    </section>
  );
};

export default AppointmentsList;

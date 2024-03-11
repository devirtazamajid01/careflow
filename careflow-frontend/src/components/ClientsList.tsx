import React, { useEffect, useState } from 'react';
import { fetchClients, Client } from '../api';

function highlight(text: string, query: string) {
  if (!query) return text;
  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <span key={i} className='bg-yellow-200 rounded px-1'>
        {part}
      </span>
    ) : (
      part
    )
  );
}

const Toast: React.FC<{
  message: string;
  show: boolean;
  onClose: () => void;
}> = ({ message, show, onClose }) => {
  if (!show) return null;
  return (
    <div className='fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50'>
      <div className='bg-blue-600 text-white px-6 py-3 rounded shadow-lg flex items-center gap-2 animate-fadeInUp'>
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

const ClientsList: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [page, setPage] = useState(1);
  const perPage = 10;
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<{ show: boolean; message: string }>({
    show: false,
    message: '',
  });

  useEffect(() => {
    fetchClients(page, perPage).then(setClients);
  }, [page]);

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className='mb-8'>
      <h2 className='text-2xl font-bold mb-2 text-blue-700'>Clients</h2>
      <p className='text-gray-500 mb-4'>
        Search and browse your client directory.
      </p>
      <div className='flex items-center gap-2 mb-4'>
        <div className='relative flex-1'>
          <svg
            className='w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z'
            />
          </svg>
          <input
            type='text'
            placeholder='Search clients by name, email or phone'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='w-full pl-9 pr-3 py-2 border border-blue-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm'
            aria-label='Search clients'
          />
        </div>
        {search && (
          <button
            onClick={() => setSearch('')}
            className='px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded border border-gray-200 text-gray-700'
          >
            Clear
          </button>
        )}
      </div>
      {!clients.length && (
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 animate-fadeIn'>
          {[1, 2, 3, 4].map((k) => (
            <div
              key={k}
              className='bg-white rounded-2xl shadow-md p-4 border border-gray-100'
            >
              <div className='h-6 w-6 rounded-full bg-gray-100 mb-3 animate-pulse' />
              <div className='h-4 w-1/2 bg-gray-100 rounded mb-2 animate-pulse' />
              <div className='h-3 w-full bg-gray-100 rounded mb-1 animate-pulse' />
              <div className='h-3 w-2/3 bg-gray-100 rounded animate-pulse' />
            </div>
          ))}
        </div>
      )}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        {filtered.map((client) => (
          <div
            key={client.id}
            className='bg-white rounded-2xl shadow-md p-4 border border-gray-100 hover:shadow-2xl hover:scale-[1.02] transition-all duration-200 cursor-pointer hover:border-blue-400 flex items-start gap-3 animate-fadeInUp'
            tabIndex={0}
            aria-label={`Client: ${client.name}`}
          >
            <div className='flex-shrink-0 mt-1'>
              <span className='inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 text-blue-600 border border-blue-100'>
                {client.name.slice(0, 1).toUpperCase()}
              </span>
            </div>
            <div>
              <div className='font-semibold text-lg text-gray-800'>
                {highlight(client.name, search)}
              </div>
              <div className='text-gray-500 text-sm flex flex-wrap gap-2 mt-1'>
                <span className='inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-50 text-gray-700 border border-gray-200'>
                  <svg
                    className='w-3.5 h-3.5 text-blue-400'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M16 12a4 4 0 10-8 0 4 4 0 008 0z'
                    />
                  </svg>
                  {highlight(client.email, search)}
                </span>
                <span className='inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-50 text-gray-700 border border-gray-200'>
                  <svg
                    className='w-3.5 h-3.5 text-green-400'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M3 5h2l3 7-1.5 3A2 2 0 009 17h6a2 2 0 001.8-1l2.1-3.5a1 1 0 00-.9-1.5H8.6'
                    />
                  </svg>
                  {highlight(client.phone, search)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
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
          disabled={clients.length < perPage}
          className='px-3 py-1.5 rounded border border-gray-200 bg-white disabled:opacity-50'
        >
          Next
        </button>
      </div>
      {filtered.length === 0 && (
        <>
          <div className='text-center text-gray-400 mt-4 bg-gray-50 border border-dashed border-gray-300 rounded-xl p-8'>
            No clients found.
          </div>
          <Toast
            message='No clients match your search.'
            show={true}
            onClose={() => setToast({ show: false, message: '' })}
          />
        </>
      )}
    </section>
  );
};

export default ClientsList;

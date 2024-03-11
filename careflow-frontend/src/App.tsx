import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import ClientsList from './components/ClientsList';
import AppointmentsList from './components/AppointmentsList';
import NewAppointmentForm from './components/NewAppointmentForm';

const App: React.FC = () => (
  <Router>
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex flex-col items-center py-10 px-2'>
      <div className='w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 border border-gray-200'>
        <h1 className='text-3xl font-extrabold text-center text-purple-700 mb-8 drop-shadow'>
          Client & Appointment Manager
        </h1>
        <nav className='flex justify-center gap-4 mb-8'>
          <NavLink to='/clients' label='Clients' color='blue' />
          <NavLink
            to='/appointments'
            label='Upcoming Appointments'
            color='green'
          />
          <NavLink
            to='/new-appointment'
            label='New Appointment'
            color='purple'
          />
        </nav>
        <Routes>
          <Route path='/' element={<Navigate to='/clients' replace />} />
          <Route path='/clients' element={<ClientsList />} />
          <Route path='/appointments' element={<AppointmentsList />} />
          <Route
            path='/new-appointment'
            element={<NewAppointmentForm onCreated={() => {}} />}
          />
        </Routes>
      </div>
    </div>
  </Router>
);

interface NavLinkProps {
  to: string;
  label: string;
  color: 'blue' | 'green' | 'purple';
}

const NavLink: React.FC<NavLinkProps> = ({ to, label, color }) => {
  const location = useLocation();
  const isActive = location.pathname.startsWith(to);
  const base = `px-4 py-2 rounded font-semibold text-${color}-700 hover:bg-${color}-100 transition focus:outline-none focus:ring-2 focus:ring-${color}-300`;
  const active = isActive ? ` bg-${color}-100 shadow-inner` : '';
  return (
    <Link to={to} className={`${base}${active ? ' ' + active : ''}`}>
      {label}
    </Link>
  );
};

export default App;

import axios, { AxiosError } from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:3000/api';

export const http = axios.create({ baseURL: API_BASE, timeout: 10000 });

http.interceptors.response.use(
  (r) => r,
  (error: AxiosError) => {
    // Normalize error message
    const message =
      (error.response?.data as any)?.error ||
      (error.response?.data as any)?.errors?.join?.(', ') ||
      error.message ||
      'Unexpected error';
    return Promise.reject(new Error(message));
  }
);

export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export interface Appointment {
  id: number;
  client_id: number;
  scheduled_at: string;
  notes: string;
  client?: Client;
}

export const fetchClients = (page = 1, perPage = 100) =>
  http
    .get<{ data: Client[] }>(`/clients`, {
      params: { page, per_page: perPage },
    })
    .then((res) => res.data.data);

export const fetchAppointments = (page = 1, perPage = 100) =>
  http
    .get<{ data: Appointment[] }>(`/appointments`, {
      params: { page, per_page: perPage },
    })
    .then((res) => res.data.data);

export const createAppointment = (data: Omit<Appointment, 'id' | 'client'>) =>
  http
    .post<Appointment>(`/appointments`, { appointment: data })
    .then((r) => r.data);

export const updateAppointment = (
  id: number,
  data: Partial<Omit<Appointment, 'id' | 'client'>>
) =>
  http
    .patch<Appointment>(`/appointments/${id}`, { appointment: data })
    .then((r) => r.data);

export const deleteAppointment = (id: number) =>
  http.delete(`/appointments/${id}`);

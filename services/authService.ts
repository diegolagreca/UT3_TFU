import { User } from '../types.ts';
import { request } from './apiClient.ts';

// Auth
export const login = (data: { email: string; password: string; }): Promise<{ token: string }> => request('/auth/login', { method: 'POST', body: JSON.stringify(data) });
export const register = (data: { email: string; password: string; name: string; }): Promise<User> => request('/auth/register', { method: 'POST', body: JSON.stringify(data) });
export const getMe = (): Promise<User> => request('/auth/me');
export const updateUser = (data: { name?: string; email?: string; }): Promise<User> => request('/auth/me', { method: 'PUT', body: JSON.stringify(data) });
export const deleteUser = (): Promise<void> => request('/auth/me', { method: 'DELETE' });
'use server';

import { ENV } from '@/utils/config';
import { revalidatePath } from 'next/cache';

export const getStaffs = async (page: number, token?: string) => {
  try {
    const response = await fetch(`${ENV.API_URL}/admin/staffs?page=${page}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Error from getStaffs action ', error);
  }
};

export const createStaff = async (
  name: string,
  email: string,
  password: string,
  token?: string
) => {
  try {
    const response = await fetch(`${ENV.API_URL}/admin/create-staff`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await response.json();

    if (response.ok) {
      revalidatePath('/');
    }
    return data;
  } catch (error) {
    console.log('Error from loginAuth action', error);
  }
};

export const updateStaff = async (
  id: string,
  name: string,
  email: string,
  password = '',
  token?: string
) => {
  try {
    const response = await fetch(`${ENV.API_URL}/admin/update-staff/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await response.json();

    if (response.ok) {
      revalidatePath('/');
    }
    return data;
  } catch (error) {
    console.log('Error from updateStaff action', error);
  }
};

export const deleteStaff = async (id: string, token?: string) => {
  try {
    const response = await fetch(`${ENV.API_URL}/admin/delete-staff/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();

    if (response.ok) {
      revalidatePath('/');
    }
    return data;
  } catch (error) {
    console.log('Error from deleteStaff action', error);
  }
};

export const getLogs = async (
  search?: string,
  page?: number,
  token?: string
) => {
  try {
    const response = await fetch(
      `${ENV.API_URL}/admin/logs?page=${page}&search=${search}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-store',
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Error from getLogs action ', error);
  }
};

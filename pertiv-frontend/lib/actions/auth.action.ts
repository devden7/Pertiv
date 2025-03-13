'use server';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { ENV } from '@/utils/config';

export const loginAuth = async (email: string, password: string) => {
  console.log('From login auth action', email, ' ', password);
  try {
    const response = await fetch(`${ENV.API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();

    if (response.ok) {
      cookies().set('token', data.token, {
        maxAge: 3600,
        httpOnly: true,
        secure: true,
      });

      revalidatePath('/');
    }
    return data;
  } catch (error) {
    console.log('Error from loginAuth action', error);
  }
};

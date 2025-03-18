'use server';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { ENV } from '@/utils/config';
import { jwtVerify } from 'jose';

export const loginAuth = async (email: string, password: string) => {
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
        maxAge: 3600 * 24,
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

export const getUserToken = async () => {
  const cookieStore = cookies();
  const getToken = cookieStore.get('token');
  if (!getToken) {
    return null;
  }
  const secret = new TextEncoder().encode(ENV.JWT_SECRET);
  const user = await jwtVerify(getToken.value, secret);
  const userInfo = {
    id: user.payload.id,
    email: user.payload.email,
    name: user.payload.name,
    role: user.payload.role,
    image: user.payload.image,
    is_penalty: user.payload.is_penalty,
  };
  return { token: getToken.value, ...userInfo };
};

export const deleteCookie = () => {
  cookies().delete('token');
};

export const regiterAccount = async (
  name: string,
  email: string,
  password: string
) => {
  try {
    const response = await fetch(`${ENV.API_URL}/user/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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

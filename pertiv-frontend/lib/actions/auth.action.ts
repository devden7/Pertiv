'use server';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { ENV } from '@/utils/config';
import { jwtVerify } from 'jose';
import { AuthUser } from '@/model/auth.model';

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
  try {
    const cookieStore = cookies();
    const getToken = cookieStore.get('token');
    if (!getToken?.value) {
      return null;
    }
    const secret = new TextEncoder().encode(ENV.JWT_SECRET);
    const user = await jwtVerify(getToken.value, secret);
    const userInfo: AuthUser = {
      id: user.payload.id as string,
      email: user.payload.email as string,
      name: user.payload.name as string,
      role: user.payload.role as string,
      image: user.payload.image as string,
    };
    return { token: getToken.value, ...userInfo };
  } catch (error) {
    console.log('Error from action getUserToken ', error);
  }
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

export const getUserInfo = async (token?: string) => {
  try {
    const response = await fetch(`${ENV.API_URL}/user/user-info`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Error from getPenaltyInfo action ', error);
  }
};

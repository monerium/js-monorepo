'use server';
import { cookies } from 'next/headers';
import cookie from 'cookie';

const signIn = async (username: string, password: string) => {
  return await fetch('https://sandbox.monerium.dev/api/iam/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  }).then((res) => {
    if (!res.ok) {
      throw { code: res.status, type: res.statusText };
    }
    const { 'session-id': sessionId, ...cookieOptions } = cookie.parse(
      res.headers.get('set-cookie')
    );
    // cookies().set('session-id', sessionId, cookieOptions);

    return res.json();
  });
};

export async function authenticate(_currentState: unknown, formData: FormData) {
  try {
    let response = await signIn(
      formData.get('email') as string,
      formData.get('password') as string
    );
  } catch (error) {
    if (error) {
      console.log(
        '%c error',
        'color:white; padding: 30px; background-color: darkgreen',
        error
      );

      switch (error.type) {
        case 'Unauthorized':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

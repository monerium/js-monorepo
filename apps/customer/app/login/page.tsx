'use client';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { redirect, useRouter } from 'next/navigation';

import { authenticate } from './actions';

export default function Page() {
  const [errorMessage, formAction] = useActionState(authenticate, undefined);

  return (
    <form action={formAction}>
      <input
        type="email"
        name="email"
        placeholder="Email"
        /*required*/ value="einaralex+app@gmail.com"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        /*required*/ value="password"
      />
      <div>{errorMessage && <p>{errorMessage}</p>}</div>
      <LoginButton />
    </form>
  );
}

function LoginButton() {
  const router = useRouter();
  const { pending } = useFormStatus();

  const handleClick = (event) => {
    if (pending) {
      event.preventDefault();
    }
  };

  return (
    <>
      <button aria-disabled={pending} type="submit" onClick={handleClick}>
        Login
      </button>
      <button
        aria-disabled={pending}
        type="submit"
        onClick={() => redirect('/')}
      >
        Reroute
      </button>
    </>
  );
}

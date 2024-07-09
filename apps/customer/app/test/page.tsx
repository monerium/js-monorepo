'use client';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// import { authenticate } from './actions';

export default function Page() {
  // const [errorMessage, formAction] = useActionState(authenticate, undefined);

  async function authenticate(formData: FormData) {
    return await fetch('/api/test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // username: 'test',
        // password: 'test',
        username: formData.get('email') as string,
        password: formData.get('password') as string,
      }),
      credentials: 'include',
    }).then((res) => {
      if (!res.ok) {
        throw { code: res.status, type: res.statusText };
      }
      // const { 'session-id': sessionId, ...cookieOptions } = cookie.parse(
      //   res.headers.get('set-cookie')
      // );
      // cookies().set('session-id', sessionId, cookieOptions);

      return res.json();
    });
  }

  return (
    <form action={authenticate}>
      <input
        type="email"
        name="email"
        placeholder="Email"
        /*required*/ value="einaralex+app@gmail.coms"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        /*required*/ value="password"
      />
      {/* <div>{errorMessage && <p>{errorMessage}</p>}</div> */}
      {/* <LoginButton /> */}
      <button
        /*aria-disabled={pending}*/ type="submit" /*onClick={handleClick}*/
      >
        Login
      </button>
    </form>
  );
}

// function LoginButton() {
//   // const router = useRouter();
//   const { pending } = useFormStatus();

//   const handleClick = (event) => {
//     if (pending) {
//       event.preventDefault();
//     }
//   };

//   return (
//     <>
//       <button aria-disabled={pending} type="submit" onClick={handleClick}>
//         Login
//       </button>
//       <button
//         aria-disabled={pending}
//         type="submit"
//         onClick={() => redirect('/')}
//       >
//         Reroute
//       </button>
//     </>
//   );
// }

// export function GET() {}
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import cookie from 'cookie';
export async function POST(request: NextRequest, response: NextResponse) {
  const requestBody = await request.json();

  let data = await fetch(`https://sandbox.monerium.dev/api/iam/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  }).then((res) => {
    if (response.ok) {
      const { 'session-id': sessionId, ...cookieOptions } = cookie.parse(
        res.headers.get('set-cookie')
      );
      cookies().set('session-id', sessionId, cookieOptions);
    } else {
      return Response.json({});
    }

    return res.json();
  });
  if (data?.code !== 200)
    return Response.json({ error: 'Something went wrong' });
  return Response.json(data);
}

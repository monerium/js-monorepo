import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import cookie from 'cookie';

export async function POST(req: NextRequest) {
  const requestBody = await req.json();

  let response;
  try {
    response = await fetch(`https://example.com`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    }).then((res) => res.json());

    if (response.code) {
      return new NextResponse(JSON.stringify(response), {
        status: response.code,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const { 'session-id': sessionId, ...cookieOptions } = cookie.parse(
      response.headers.get('set-cookie')
    );
    cookies().set('session-id', sessionId, cookieOptions);

    return new NextResponse(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: (error as Error).message }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

export async function GET(req: NextRequest) {
  return Response.json({ data: 'example' });
}

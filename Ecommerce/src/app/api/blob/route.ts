import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

const MAX_IMAGE_SIZE = 4 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export const maxDuration = 60;

function safeFilename(filename: string): string {
  return filename
    .normalize('NFKD')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'avatar';
}

export async function POST(request: Request) {
  const authorization = request.headers.get('authorization');
  const backendBaseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
  const filename = new URL(request.url).searchParams.get('filename') ?? '';
  const contentType = request.headers.get('content-type') ?? '';
  const contentLength = Number(request.headers.get('content-length') ?? 0);

  if (!authorization?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Authentication is required.' }, { status: 401 });
  }
  if (!backendBaseUrl) {
    return NextResponse.json({ error: 'The backend URL is not configured.' }, { status: 500 });
  }
  if (!filename) {
    return NextResponse.json({ error: 'A filename is required.' }, { status: 400 });
  }
  if (!ALLOWED_IMAGE_TYPES.has(contentType)) {
    return NextResponse.json({ error: 'Only PNG, JPG and WebP images are supported.' }, { status: 415 });
  }
  if (contentLength > MAX_IMAGE_SIZE) {
    return NextResponse.json({ error: 'Images must be 4 MB or smaller.' }, { status: 413 });
  }

  try {
    // Verify the JWT with Django before using the server-only Blob credential.
    const profileResponse = await fetch(
      `${backendBaseUrl.replace(/\/$/, '')}/api/auth/me/`,
      { headers: { Authorization: authorization }, cache: 'no-store' },
    );
    if (!profileResponse.ok) {
      return NextResponse.json({ error: 'Your session is invalid or has expired.' }, { status: 401 });
    }

    const rawBytes = await request.arrayBuffer();
    if (rawBytes.byteLength === 0) {
      return NextResponse.json({ error: 'No image was provided.' }, { status: 400 });
    }
    if (rawBytes.byteLength > MAX_IMAGE_SIZE) {
      return NextResponse.json({ error: 'Images must be 4 MB or smaller.' }, { status: 413 });
    }

    const blob = await put(`avatars/${safeFilename(filename)}`, rawBytes, {
      access: 'public',
      addRandomSuffix: true,
      contentType,
    });
    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error('Vercel Blob avatar upload failed:', error);
    return NextResponse.json({ error: 'Image upload failed. Please try again.' }, { status: 502 });
  }
}

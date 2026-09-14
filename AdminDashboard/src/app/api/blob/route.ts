import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const ALLOWED_FOLDERS = new Set(['products', 'banners']);
const MAX_IMAGE_SIZE = 4 * 1024 * 1024;

export const maxDuration = 60;

function safeFilename(filename: string): string {
  return filename
    .normalize('NFKD')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'image';
}

export async function POST(request: Request) {
  const authorization = request.headers.get('authorization');
  // The browser-facing URL is localhost, while the Docker container must use
  // the Compose service name to reach Django over the internal network.
  const backendBaseUrl = process.env.BACKEND_INTERNAL_URL || process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

  if (!authorization?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Authentication is required.' }, { status: 401 });
  }
  if (!backendBaseUrl) {
    return NextResponse.json({ error: 'The backend URL is not configured.' }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const folder = searchParams.get('folder') ?? '';
  const filename = searchParams.get('filename') ?? '';
  const contentType = request.headers.get('content-type') ?? '';
  const contentLength = Number(request.headers.get('content-length') ?? 0);

  if (!ALLOWED_FOLDERS.has(folder) || !filename) {
    return NextResponse.json({ error: 'A valid image destination is required.' }, { status: 400 });
  }
  if (!ALLOWED_IMAGE_TYPES.has(contentType)) {
    return NextResponse.json({ error: 'Only PNG, JPG and WebP images are supported.' }, { status: 415 });
  }
  if (contentLength > MAX_IMAGE_SIZE) {
    return NextResponse.json({ error: 'Images must be 4 MB or smaller.' }, { status: 413 });
  }
  if (!request.body) {
    return NextResponse.json({ error: 'No image was provided.' }, { status: 400 });
  }

  try {
    // Django remains the authorization authority; the Blob token never reaches
    // the browser. Only staff users may upload catalog and banner images.
    const profileResponse = await fetch(
      `${backendBaseUrl.replace(/\/$/, '')}/api/auth/me/`,
      { headers: { Authorization: authorization }, cache: 'no-store' },
    );
    const profile = (await profileResponse.json().catch(() => null)) as { is_staff?: boolean } | null;
    if (!profileResponse.ok) {
      return NextResponse.json({ error: 'Your session is invalid or has expired.' }, { status: 401 });
    }
    if (!profile?.is_staff) {
      return NextResponse.json({ error: 'Admin access is required.' }, { status: 403 });
    }

    const rawBytes = await request.arrayBuffer();
    if (rawBytes.byteLength === 0) {
      return NextResponse.json({ error: 'No image was provided.' }, { status: 400 });
    }
    if (rawBytes.byteLength > MAX_IMAGE_SIZE) {
      return NextResponse.json({ error: 'Images must be 4 MB or smaller.' }, { status: 413 });
    }

    const blob = await put(`${folder}/${safeFilename(filename)}`, rawBytes, {
      access: 'public',
      addRandomSuffix: true,
      contentType,
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error('Vercel Blob upload failed:', error);
    return NextResponse.json({ error: 'Image upload failed. Please try again.' }, { status: 502 });
  }
}

const MAX_IMAGE_SIZE = 4 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export async function uploadImage(file: File, folder: 'products' | 'banners'): Promise<string> {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error('Only PNG, JPG and WebP images are supported.');
  }
  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error('Images must be 4 MB or smaller.');
  }

  const token = localStorage.getItem('token');
  if (!token) throw new Error('Please sign in before uploading an image.');

  const params = new URLSearchParams({ filename: file.name, folder });
  const response = await fetch(`/api/blob?${params}`, {
    method: 'POST',
    body: file,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': file.type,
    },
  });

  const result = (await response.json().catch(() => null)) as { url?: string; error?: string } | null;
  if (!response.ok || !result?.url) {
    throw new Error(result?.error || 'Image upload failed. Please try again.');
  }
  return result.url;
}

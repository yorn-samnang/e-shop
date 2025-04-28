// src/utils/imageUtils.ts
export function getImageUrl(imagePath: string | null | undefined): string {
    if (!imagePath) return '/images/placeholder.png';
    
    const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || 'http://localhost:8000';
    
    // If it's already a full URL, return it
    if (imagePath.startsWith('http')) return imagePath;
    
    // If it's a relative path, construct the full URL
    return `${IMAGE_BASE_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  }
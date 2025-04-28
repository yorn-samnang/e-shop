// src/components/products/ProductImage.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FiImage } from 'react-icons/fi'; // Import an icon

interface ProductImageProps {
  src: string | null | undefined;
  alt: string;
  priority?: boolean;
  className?: string;
}

const ProductImage: React.FC<ProductImageProps> = ({ 
  src, 
  alt, 
  priority = false,
  className = ''
}) => {
  const [isError, setIsError] = useState(false);
  const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || 'http://localhost:8000';
  
  // Process the image URL
  let imageSrc = '';
  let hasValidImage = false;
  
  if (src && !isError) {
    hasValidImage = true;
    
    // Check if the URL is complete or needs a base URL
    if (src.startsWith('http')) {
      imageSrc = src;
    } else {
      imageSrc = `${IMAGE_BASE_URL}${src.startsWith('/') ? '' : '/'}${src}`;
    }
  }

  // If no valid image, show a placeholder div
  if (!hasValidImage) {
    return (
      <div className={`w-full h-full bg-gray-200 flex items-center justify-center ${className}`}>
        <FiImage className="h-1/3 w-1/3 text-gray-400" />
      </div>
    );
  }

  // Otherwise show the image
  return (
    <Image
      src={imageSrc}
      alt={alt}
      fill
      priority={priority}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      className={`object-cover ${className}`}
      onError={() => setIsError(true)}
      unoptimized={imageSrc.startsWith('http')}
    />
  );
};

export default ProductImage;
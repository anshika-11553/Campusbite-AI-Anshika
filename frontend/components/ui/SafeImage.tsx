'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';

const DEFAULT_FALLBACK_IMAGE = '/images/food/default-food.jpg';

interface SafeImageProps extends Omit<ImageProps, 'src'> {
  src?: string | null;
  fallbackSrc?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  fallbackSrc = DEFAULT_FALLBACK_IMAGE,
  alt,
  ...props
}) => {
  const [hasError, setHasError] = useState<boolean>(false);

  const initialSrc = (src && typeof src === 'string' && src.trim().length > 0) ? src : fallbackSrc;
  const currentSrc = hasError ? fallbackSrc : initialSrc;

  return (
    <Image
      {...props}
      src={currentSrc}
      alt={alt || 'Food item image'}
      onError={() => setHasError(true)}
      unoptimized={currentSrc.startsWith('data:') || currentSrc.startsWith('blob:')}
    />
  );
};

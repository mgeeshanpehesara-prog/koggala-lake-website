"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

const FALLBACK_IMAGE = "/images/fallback-image.svg";

type SafeImageProps = Omit<ImageProps, "src"> & {
  src?: string | null;
  fallbackSrc?: string;
};

export default function SafeImage({
  src,
  fallbackSrc = FALLBACK_IMAGE,
  alt,
  ...props
}: SafeImageProps) {
  const [currentSrc, setCurrentSrc] = useState<string>(src || fallbackSrc);
  const [hasError, setHasError] = useState(false);

  const resolvedSrc = !src || hasError ? fallbackSrc : currentSrc;

  return (
    <Image
      {...props}
      src={resolvedSrc}
      alt={alt}
      onError={() => {
        if (!hasError && currentSrc !== fallbackSrc) {
          setHasError(true);
          setCurrentSrc(fallbackSrc);
        }
      }}
    />
  );
}

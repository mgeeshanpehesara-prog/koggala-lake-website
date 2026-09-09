"use client";

/* eslint-disable @next/next/no-img-element */

import { useState } from "react";

type PlatformLogoProps = {
  name: string;
  mark: string;
  uploadedUrl?: string;
  fallbackUrl: string;
};

export default function PlatformLogo({ name, mark, uploadedUrl, fallbackUrl }: PlatformLogoProps) {
  const [uploadedFailed, setUploadedFailed] = useState(false);
  const [fallbackFailed, setFallbackFailed] = useState(false);
  const showUploadedLogo = Boolean(uploadedUrl) && !uploadedFailed;

  return (
    <div className="review-platform-mark" aria-label={`${name} logo`}>
      {showUploadedLogo ? (
        <img src={uploadedUrl} alt={`${name} logo`} onError={() => setUploadedFailed(true)} />
      ) : !fallbackFailed ? (
        <img src={fallbackUrl} alt={`${name} logo`} onError={() => setFallbackFailed(true)} />
      ) : (
        <span aria-hidden="true">{mark}</span>
      )}
    </div>
  );
}

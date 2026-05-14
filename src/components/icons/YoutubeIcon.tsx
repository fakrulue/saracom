// src/components/icons/YoutubeIcon.tsx
import React from "react";

export function YoutubeIcon({ size = 24, ...props }: React.SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="20" height="14" x="2" y="5" rx="3" ry="3" />
      <polygon points="10,8 16,12 10,16" fill="currentColor" />
    </svg>
  );
}

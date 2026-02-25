"use client";

import Image from "next/image";

const Photo = () => {
  return (
    <div className="w-full h-full relative">
      <div className="w-full h-full relative">
        {/* Gradient Background Layer - Shows immediately */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-secondary-default/20 via-blue-500/10 to-purple-500/20" />

        {/* Profile Image Layer - Overlays gradient */}
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <Image
            src="/assets/profile/profile-small.png"
            priority
            quality={90}
            fill
            alt="Niloy Kumar Barman Panday - Full-Stack .NET Developer"
            className="object-cover"
            sizes="(max-width: 1280px) 300px, 506px"
            loading="eager"
            fetchPriority="high"
          />
        </div>

        {/* Animated Border Circle - Top layer */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <svg
            className="w-full h-full animate-spin-slow"
            fill="transparent"
            viewBox="0 0 506 506"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="253"
              cy="253"
              r="250"
              stroke="var(--color-secondary-default)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="15 120 25 25"
              className="animate-pulse"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Photo;

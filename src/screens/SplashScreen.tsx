"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const SplashScreen = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/main');
    }, 2500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="fixed inset-0 bg-base-100 flex items-center justify-center">
      {/* Animated Circles */}
      <div className="relative w-64 h-64">
        <div className="absolute inset-0 rounded-full border-2 border-accent/15 animate-[pulse_2s_ease-in-out_infinite]" />
        <div className="absolute inset-4 rounded-full border-2 border-accent/25 animate-[pulse_2s_ease-in-out_infinite_0.5s]" />
        <div className="absolute inset-8 rounded-full border-2 border-accent/35 animate-[pulse_2s_ease-in-out_infinite_1s]" />
      </div>

      {/* Logo */}
      <div className="absolute">
        <h1 className="text-6xl font-['Dancing_Script'] font-semibold tracking-wide animate-[fadeIn_1s_ease-out]">
          <span className="text-accent">
            Reemember
          </span>
        </h1>
      </div>

      {/* Loading Dots */}
      <div className="absolute bottom-20 flex gap-2">
        <div className="w-2 h-2 rounded-full bg-accent animate-[bounce_1s_ease-in-out_infinite]" />
        <div className="w-2 h-2 rounded-full bg-accent animate-[bounce_1s_ease-in-out_infinite_0.2s]" />
        <div className="w-2 h-2 rounded-full bg-accent animate-[bounce_1s_ease-in-out_infinite_0.4s]" />
      </div>
    </div>
  );
};

export default SplashScreen; 
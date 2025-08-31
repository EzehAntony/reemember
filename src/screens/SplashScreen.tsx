"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '../data/data';

const SplashScreen = () => {
  const color = localStorage.getItem( "theme" ) || "valentine";
  const router = useRouter();

  useEffect( () => {
    const timer = setTimeout( () => {
      router.push( '/home' );
    }, 2500 );

    return () => clearTimeout( timer );
  }, [ router ] );

  //Theme set
  useEffect( () => {
    document.querySelector( "html" )?.setAttribute( "data-theme", color );

  } );


  return (
    <div data-theme={ color } className="fixed inset-0 bg-base-300 flex items-center justify-center">
      {/* Animated Circles */ }
      <div className="relative w-64 h-64">
        <div className="absolute inset-0 rounded-full border-2 border-primary/15 animate-[pulse_2s_ease-in-out_infinite]" />
        <div className="absolute inset-4 rounded-full border-2 border-primary/25 animate-[pulse_2s_ease-in-out_infinite_0.5s] flex flex-col justify-center items-center">
          <Logo />
        </div>
        <div className="absolute inset-8 rounded-full border-2 border-primary/35 animate-[pulse_2s_ease-in-out_infinite_1s]" />
      </div>

      {/* Loading Dots */ }
      <div className="absolute bottom-20 flex gap-2">
        <div className="w-2 h-2 rounded-full bg-primary animate-[bounce_1s_ease-in-out_infinite]" />
        <div className="w-2 h-2 rounded-full bg-primary animate-[bounce_1s_ease-in-out_infinite_0.2s]" />
        <div className="w-2 h-2 rounded-full bg-primary animate-[bounce_1s_ease-in-out_infinite_0.4s]" />
      </div>
    </div>
  );
};

export default SplashScreen; 
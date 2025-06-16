import dynamic from 'next/dynamic';

const SplashScreen = dynamic(() => import('../screens/SplashScreen'), {
  loading: () => <div className="w-screen h-screen bg-black" />
});

export default function Home() {
  return <SplashScreen />;
}
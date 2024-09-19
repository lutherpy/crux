// components/SessionTimer.tsx
'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const SessionTimer: React.FC = () => {
  const { data: session } = useSession();
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    if (session && session.expires) {
      const expiryTime = new Date(session.expires).getTime();
      const intervalId = setInterval(() => {
        const now = new Date().getTime();
        const distance = expiryTime - now;
        if (distance <= 0) {
          clearInterval(intervalId);
          setTimeLeft(0);
        } else {
          setTimeLeft(Math.floor(distance / 1000));
        }
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [session]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  return (
    <div>
      {session ? (
        <p>Tempo restante da sessão: {formatTime(timeLeft)}</p>
      ) : (
        <p>Carregando sessão...</p>
      )}
    </div>
  );
};

export default SessionTimer;

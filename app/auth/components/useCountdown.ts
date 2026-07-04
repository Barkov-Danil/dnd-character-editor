import { useEffect, useRef, useState } from 'react';

export function useCountdown(initial: number) {
  const [seconds, setSeconds] = useState(initial);
  const [active, setActive] = useState(true);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!active) return;
    timer.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          if (timer.current) clearInterval(timer.current);
          setActive(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [active]);

  const restart = (next?: number) => {
    if (timer.current) clearInterval(timer.current);
    setSeconds(next ?? initial);
    setActive(true);
  };

  return { seconds, active, restart };
}

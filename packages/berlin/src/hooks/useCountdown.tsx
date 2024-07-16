import { useState, useEffect } from 'react';

interface Countdown {
  formattedTime: string;
  cycleState: string;
  time: number | null;
}

const useCountdown = (startAt: string | null, endAt: string | null): Countdown => {
  const [time, setTime] = useState<number | null>(null);
  const [cycleState, setCycleState] = useState<string>('');

  useEffect(() => {
    if (startAt && endAt) {
      const startTimestamp = Math.floor(new Date(startAt).getTime() / 1000);
      const endTimestamp = Math.floor(new Date(endAt).getTime() / 1000);
      const now = Math.floor(Date.now() / 1000);

      if (now < startTimestamp) {
        // Cycle is upcoming
        setCycleState('upcoming');
        setTime(startTimestamp - now);
      } else if (now < endTimestamp) {
        // Cycle is open
        setCycleState('open');
        setTime(endTimestamp - now);
      } else {
        // Cycle is closed
        setCycleState('closed');
        setTime(0);
      }

      const timer = setInterval(() => {
        setTime((prevTime) => (prevTime && prevTime > 0 ? prevTime - 1 : 0));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [startAt, endAt]);

  const pluralize = (value: number, unit: string): string => {
    return `${value} ${unit}${value !== 1 ? 's' : ''}`;
  };

  const calculateTime = (): string => {
    if (time === null || time <= 0) {
      return 'Cycle has expired';
    }

    const days = Math.floor(time / 86400);
    const hours = Math.floor((time % 86400) / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    if (days > 1) {
      return `${pluralize(days, 'day')} ${pluralize(hours, 'hour')}`;
    } else if (hours >= 1) {
      return `${pluralize(hours, 'hour')} ${pluralize(minutes, 'minute')}`;
    } else {
      return `${pluralize(minutes, 'minute')} ${pluralize(seconds, 'second')}`;
    }
  };

  return { formattedTime: calculateTime(), cycleState, time };
};

export default useCountdown;

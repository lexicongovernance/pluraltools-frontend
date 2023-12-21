import { useState, useEffect } from 'react';

interface Countdown {
  formattedTime: string;
}

const useCountdown = (startAt: number, endAt: number): Countdown => {
  const [time, setTime] = useState<number>(Math.max(0, endAt - Math.floor(Date.now() / 1000)));

  useEffect(() => {
    const now = Math.floor(Date.now() / 1000);
    const startTimePassed = now >= startAt;

    if (startTimePassed) {
      const timer = setInterval(() => {
        setTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [startAt, endAt]);

  const pluralize = (value: number, unit: string): string => {
    return `${value} ${unit}${value !== 1 ? 's' : ''}`;
  };

  const calculateTime = (): string => {
    if (time <= 0) {
      return 'Cycle has expired';
    }

    const days = Math.floor(time / 86400);
    const hours = Math.floor((time % 86400) / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    if (days > 0) {
      return `${pluralize(days, 'day')} ${pluralize(hours, 'hour')} ${pluralize(
        minutes,
        'minute'
      )} ${pluralize(seconds, 'second')}`;
    }

    return `${pluralize(hours, 'hour')} ${pluralize(minutes, 'minute')} ${pluralize(
      seconds,
      'second'
    )}`;
  };

  return { formattedTime: calculateTime() };
};

export default useCountdown;

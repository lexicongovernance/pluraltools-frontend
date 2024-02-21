import { useState, useEffect } from 'react';

interface Countdown {
  formattedTime: string;
}

const useCountdown = (startAt: string | null, endAt: string | null): Countdown => {
  const [time, setTime] = useState<number | null>(null);

  useEffect(() => {
    if (startAt && endAt) {
      const endTimestamp = new Date(endAt).getTime() / 1000;
      const now = Math.floor(Date.now() / 1000);

      if (now < endTimestamp) {
        const initialTime = Math.max(0, endTimestamp - now);
        setTime(initialTime);

        const timer = setInterval(() => {
          setTime((prevTime) => (prevTime && prevTime > 0 ? prevTime - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
      }
    }
  }, [startAt, endAt]);

  const pluralize = (value: number, unit: string): string => {
    return `${value} ${unit}${value !== 1 ? 's' : ''}`;
  };

  const calculateTime = (): string => {
    if (time === null || time <= 0) {
      return 'Cycle has expired';
    } else if (startAt && endAt) {
      const startTimestamp = new Date(startAt).getTime() / 1000;
      const now = Math.floor(Date.now() / 1000);

      if (now < startTimestamp) {
        // If current time is before start time, cycle is upcoming
        return 'Cycle is upcoming';
      }
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

import { useState, useEffect } from 'react';

// Обратный отсчёт в секундах. Возвращает текущее время и флаг истечения.
// Реакцию на истечение (isExpired) описывает сам компонент.
export function useCountdown(initialSeconds) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timerId = window.setTimeout(() => {
      setTimeLeft((current) => current - 1);
    }, 1000);

    return () => window.clearTimeout(timerId);
  }, [timeLeft]);

  return { timeLeft, isExpired: timeLeft <= 0 };
}

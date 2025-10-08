import { useCallback, useEffect, useRef, useState } from "react";

export function useCountdown(initial: number = 60) {
  const [count, setCount] = useState(initial);
  const countRef = useRef(count);

  useEffect(() => {
    countRef.current = count;
  }, [count]);

  useEffect(() => {
    if (countRef.current <= 0) return;

    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup
    return () => {
      clearInterval(timer);
    };
  }, []);

  const reset = useCallback(() => setCount(initial), [initial]);

  return { count, reset };
}

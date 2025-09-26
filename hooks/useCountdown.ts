import { useCallback, useEffect, useState } from "react";

export function useCountdown(initial: number = 60) {
  const [count, setCount] = useState(initial);

  useEffect(() => {
    if (count <= 0) return;
    const timer = setInterval(() => {
      setCount((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [count]);

  const reset = useCallback(() => setCount(initial), [initial]);

  return { count, reset };
}

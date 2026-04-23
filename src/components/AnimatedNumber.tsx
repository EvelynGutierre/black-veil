import { useEffect, useRef, useState } from "react";

export default function AnimatedNumber({
  value,
  duration = 600,
}: {
  value: number;
  duration?: number;
}) {
  const [displayValue, setDisplayValue] = useState(value);
  const previousRef = useRef(value);

  useEffect(() => {
    const start = previousRef.current;
    const end = value;
    let frame = 0;
    const startTime = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);

      const eased =
        start > end
          ? progress
          : 1 - Math.pow(1 - progress, 3);

      const next = Math.round(start + (end - start) * eased);
      setDisplayValue(next);

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        previousRef.current = end;
      }
    };

    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  return <>{displayValue}</>;
}
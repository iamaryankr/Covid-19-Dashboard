import { useEffect, useRef } from 'react';
export default function useInterval(fn, delay) {
  const ref = useRef();
  useEffect(() => { ref.current = fn; }, [fn]);
  useEffect(() => {
    if (delay != null) {
      const id = setInterval(() => ref.current(), delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

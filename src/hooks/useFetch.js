import { useCallback, useEffect, useState } from 'react';

/** Runs `fetcher` on mount and whenever `deps` change. Ignores results of outdated requests. */
export default function useFetch(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    fetcher()
      .then((result) => active && setData(result))
      .catch((err) => active && setError(err.userMessage || err.message || 'Something went wrong'))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);

  const reload = useCallback(() => setTick((t) => t + 1), []);
  return { data, loading, error, reload };
}

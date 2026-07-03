import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthError } from './api';

// Load async data on mount; bounce to login on auth failure.
export function useLoad(loader) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      setData(await loader());
    } catch (e) {
      if (e instanceof AuthError) navigate('/admin/login');
    } finally {
      setLoading(false);
    }
    // loader identity is stable per page; deps intentionally omitted
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, loading, reload, setData };
}

// Wrap a mutating action: runs it, shows a toast, redirects on auth error.
export function useAction(toast) {
  const navigate = useNavigate();
  return useCallback(
    async (fn, successMsg) => {
      try {
        await fn();
        if (successMsg) toast(successMsg);
        return true;
      } catch (e) {
        if (e instanceof AuthError) {
          navigate('/admin/login');
        } else {
          toast(e.message || 'Something went wrong', true);
        }
        return false;
      }
    },
    [navigate, toast],
  );
}

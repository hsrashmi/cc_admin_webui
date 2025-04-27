// hooks/useApi.js

import { useState, useEffect, useCallback, useRef } from "react";
import { apiWrapper } from "../UtilFuncs";
import { useNavigate } from "react-router-dom";
import { extractErrorMessage } from "../UtilFuncs";
import { getConfig } from "../config";

const config = getConfig();

export function useApi(
  apiFunction,
  options = { immediate: true, retries: config.MAX_RETRIES }
) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null); // 👈 keep error in state
  const [loading, setLoading] = useState(false);
  const controllerRef = useRef(null); // for AbortController
  const navigate = useNavigate();

  const execute = useCallback(
    async (params = null) => {
      setLoading(true);
      setError(null);

      if (controllerRef.current) {
        controllerRef.current.abort();
      }
      controllerRef.current = new AbortController();
      const signal = controllerRef.current.signal;

      let attempt = 0;
      let lastError = null;

      while (attempt <= options.retries) {
        try {
          const { success, data, error } = await apiWrapper(() =>
            apiFunction(params, { signal })
          );

          if (success) {
            setData(data);
            setLoading(false);
            return { success: true, data };
          } else {
            lastError = error;

            if (error?.status === 401) {
              navigate("/login");
              return { success: false, error };
            }

            if (attempt < options.retries) {
              attempt++;
              continue; // Retry
            }

            setError(() => ({ message: extractErrorMessage(error) }));
            setLoading(false);
            return { success: false, error };
          }
        } catch (err) {
          if (signal.aborted) {
            return { success: false, error: { message: "Request canceled" } };
          }

          lastError = err;
          setError({ message: extractErrorMessage(error) });
          setLoading(false);
          return { success: false, error: err };
        }
      }

      setLoading(false);
      return { success: false, error: lastError };
    },
    [apiFunction, navigate, options.retries, error]
  );

  useEffect(() => {
    if (options.immediate) {
      execute();
    }
    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, [execute, options.immediate]);

  return { data, error, loading, execute };
}

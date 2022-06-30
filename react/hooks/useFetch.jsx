/**
 * Hook for making a HTTP request using fetch with a set of default headers
 */
import { useEffect, useState } from "react";

const defaultHeaders = {
  Accept: "application/json",
  "X-Requested-With": "XMLHttpRequest",
  "X-CSRF-TOKEN":
    document.querySelector("[name=csrf-token]") &&
    document.querySelector("[name=csrf-token]").content,
};

const useFetch = (submitting, url, verb, headers, body) => {
  const [dataState, setDataState] = useState({
    payload: null,
    loading: false,
    error: false,
  });

  useEffect(() => {
    if (submitting && !dataState.loading) {
      setDataState({ payload: null, loading: true, error: false });
      fetch(url, {
        method: verb,
        headers: {
          ...defaultHeaders,
          ...headers,
        },
        body,
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error((response && response.json()) || response.statusText);
        })
        .then((payload) => {
          setDataState({ payload, loading: false, error: false });
        })
        .catch((err) => {
          setDataState({ payload: err, loading: false, error: true });
        });
    }
  }, [submitting]);

  return dataState;
};

export default useFetch;

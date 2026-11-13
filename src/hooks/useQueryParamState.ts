import { useCallback, useEffect, useState } from 'react';

const HISTORY_MARKER = '__portfolioParam';

function readParam(name: string): string | null {
  if (typeof window === 'undefined') return null; // build-time prerender
  return new URLSearchParams(window.location.search).get(name);
}

function urlWith(name: string, value: string | null): string {
  const url = new URL(window.location.href);
  if (value === null) url.searchParams.delete(name);
  else url.searchParams.set(name, value);
  return `${url.pathname}${url.search}${url.hash}`;
}

/**
 * Keeps one query parameter (e.g. `?project=<id>`) in sync with state, so a view can be
 * deep-linked and closed with the browser Back button. Values outside `allowed` are ignored.
 */
export function useQueryParamState(
  name: string,
  allowed: readonly string[],
): [value: string | null, set: (value: string) => void, clear: () => void] {
  const allowedKey = allowed.join('|');
  const sanitize = useCallback(
    (value: string | null) => (value !== null && allowedKey.split('|').includes(value) ? value : null),
    [allowedKey],
  );
  const [value, setValue] = useState<string | null>(() => sanitize(readParam(name)));

  useEffect(() => {
    const onPopState = () => setValue(sanitize(readParam(name)));
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [name, sanitize]);

  const set = useCallback(
    (next: string) => {
      const safe = sanitize(next);
      if (safe === null) return;
      window.history.pushState({ [HISTORY_MARKER]: name }, '', urlWith(name, safe));
      setValue(safe);
    },
    [name, sanitize],
  );

  const clear = useCallback(() => {
    const state = window.history.state as Record<string, unknown> | null;
    if (state?.[HISTORY_MARKER] === name) {
      // This entry was pushed by `set`: going back restores the previous URL.
      window.history.back();
    } else {
      window.history.replaceState(window.history.state, '', urlWith(name, null));
    }
    setValue(null);
  }, [name]);

  return [value, set, clear];
}

import React, { useEffect, useRef, useContext } from 'react';
import { IntentContext } from './IntentProvider';

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  prefetchFn: () => Promise<void> | void;
}

export const IntentLink: React.FC<Props> = ({ href, prefetchFn, children, onMouseEnter, ...props }) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const registry = useContext(IntentContext);
  const prefetchFnRef = useRef(prefetchFn);
  const didPrefetch = useRef(false);

  // Keep callback fresh
  useEffect(() => {
    if (prefetchFnRef.current !== prefetchFn) {
      prefetchFnRef.current = prefetchFn;
      didPrefetch.current = false; // Reset prefetch state if function changes
    }
  }, [prefetchFn]);

  const triggerPrefetch = () => {
    if (didPrefetch.current) return;
    didPrefetch.current = true;
    Promise.resolve(prefetchFnRef.current()).catch(console.error);
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    registry.set(el, {
      element: el,
      callback: triggerPrefetch,
      rect: el.getBoundingClientRect()
    });

    return () => {
      registry.delete(el);
    };
  }, [registry]);

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    triggerPrefetch();
    if (onMouseEnter) {
      onMouseEnter(e);
    }
  };

  return (
    <a ref={ref} href={href} onMouseEnter={handleMouseEnter} {...props}>
      {children}
    </a>
  );
};

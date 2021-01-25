import {useState, useEffect, RefObject} from 'react';

export function useEnteredViewportOnce(ref: RefObject<HTMLElement>) {
  const [isEnteredViewportOnce, setIsEnteredViewportOnce] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      (cards, obs) => {
        const card = cards[0];
        if (!card.isIntersecting) return;
        setIsEnteredViewportOnce(true);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        obs.unobserve(ref.current!);
      },
      {
        rootMargin: '-40px 0px',
      }
    );
    observer.observe(ref.current);
  }, [ref]);

  return [isEnteredViewportOnce] as const;
}

import { RefObject, useEffect, useRef, useState } from 'react';
import {
  AUTO_SCROLL_PIXELS_PER_SECOND,
  AUTO_SCROLL_RESUME_DELAY,
} from '../constants';

// Interactions that mean the viewer has taken over. Deliberately excludes
// plain pointer movement: the drift should not stop just because the cursor
// happens to be resting over the wall.
const TAKEOVER_EVENTS = ['wheel', 'touchstart', 'pointerdown'];

const prefersReducedMotion = (): boolean => {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (error) {
    return false;
  }
};

type TAutoScrollParams = {
  containerRef: RefObject<HTMLElement>;
  enabled: boolean;
};

/**
 * Drifts a scroll container downward at a constant speed, yielding to the
 * viewer whenever they scroll for themselves and picking back up once they
 * have been idle for a moment.
 */
const useAutoScroll = ({ containerRef, enabled }: TAutoScrollParams) => {
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const pauseTimeout = useRef<ReturnType<typeof setTimeout>>();
  const frame = useRef<number>();
  const lastFrameTime = useRef<number>();
  // At this speed a frame advances well under a pixel, so the remainder has
  // to carry across frames or the wall never moves at all.
  const carry = useRef<number>(0);

  // Pausing is driven by real input, which can arrive whether or not the
  // drift is currently running.
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !enabled) {
      return undefined;
    }

    const handleTakeover = () => {
      setIsPaused(true);
      clearTimeout(pauseTimeout.current);
      pauseTimeout.current = setTimeout(
        () => setIsPaused(false),
        AUTO_SCROLL_RESUME_DELAY
      );
    };

    TAKEOVER_EVENTS.forEach((eventName) =>
      container.addEventListener(eventName, handleTakeover, { passive: true })
    );
    window.addEventListener('keydown', handleTakeover);

    return () => {
      TAKEOVER_EVENTS.forEach((eventName) =>
        container.removeEventListener(eventName, handleTakeover)
      );
      window.removeEventListener('keydown', handleTakeover);
      clearTimeout(pauseTimeout.current);
    };
  }, [containerRef, enabled]);

  useEffect(() => {
    // A background tab still runs rAF in some cases, and scrolling one is
    // wasted work the viewer will never see.
    const isHidden = () => document.visibilityState === 'hidden';
    const isActive = enabled && !isPaused && !prefersReducedMotion();

    if (!isActive) {
      return undefined;
    }

    const step = (timestamp: number) => {
      const container = containerRef.current;
      if (!container) {
        return;
      }

      if (lastFrameTime.current === undefined) {
        lastFrameTime.current = timestamp;
      }
      const elapsed = (timestamp - lastFrameTime.current) / 1000;
      lastFrameTime.current = timestamp;

      if (!isHidden()) {
        carry.current += elapsed * AUTO_SCROLL_PIXELS_PER_SECOND;
        const whole = Math.floor(carry.current);

        if (whole >= 1) {
          carry.current -= whole;
          const maxScroll = container.scrollHeight - container.clientHeight;
          container.scrollTop = Math.min(
            maxScroll,
            container.scrollTop + whole
          );
        }
      }

      frame.current = requestAnimationFrame(step);
    };

    frame.current = requestAnimationFrame(step);

    return () => {
      if (frame.current !== undefined) {
        cancelAnimationFrame(frame.current);
      }
      // The next run must not attribute the whole paused interval to one
      // frame, which would jump the wall forward.
      lastFrameTime.current = undefined;
      carry.current = 0;
    };
  }, [containerRef, enabled, isPaused]);

  return { isPaused };
};

export default useAutoScroll;

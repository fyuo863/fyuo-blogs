import { useEffect, useRef, useState } from "react";

const SPLASH_DURATION = 3000;

export function useSplash(isHome) {
  const splashPlayedRef = useRef(false);
  const splashStartRef = useRef(0);

  const [splashPhase, setSplashPhase] = useState(() => {
    return isHome ? "visible" : "done";
  });

  useEffect(() => {
    if (!isHome) {
      splashPlayedRef.current = true;
      return;
    }

    if (splashPlayedRef.current) {
      return;
    }

    if (splashPhase !== "visible") {
      return;
    }

    if (splashStartRef.current === 0) {
      splashStartRef.current = Date.now();
    }

    const elapsed = Date.now() - splashStartRef.current;
    const remaining = Math.max(0, SPLASH_DURATION - elapsed);

    const timer = setTimeout(() => {
      setSplashPhase("exiting");
    }, remaining);

    return () => clearTimeout(timer);
  }, [isHome, splashPhase]);

  const finishSplash = () => {
    splashPlayedRef.current = true;
    setSplashPhase("done");
  };

  const shouldShowSplash = isHome && splashPhase !== "done";
  const showNav = !shouldShowSplash;

  return {
    splashPhase,
    shouldShowSplash,
    showNav,
    finishSplash,
  };
}
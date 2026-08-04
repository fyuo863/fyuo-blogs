import { useEffect } from "react";

function PointerField() {
  useEffect(() => {
    const supportsPointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!supportsPointer.matches || reduceMotion.matches) return undefined;

    let frame = 0;
    let nextX = window.innerWidth / 2;
    let nextY = window.innerHeight / 3;

    const paint = () => {
      document.documentElement.style.setProperty("--pointer-x", `${nextX}px`);
      document.documentElement.style.setProperty("--pointer-y", `${nextY}px`);
      frame = 0;
    };

    const onPointerMove = (event) => {
      nextX = event.clientX;
      nextY = event.clientY;
      if (!frame) frame = window.requestAnimationFrame(paint);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return <div className="pointer-field" aria-hidden="true" />;
}

export default PointerField;

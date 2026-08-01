import { useEffect, useRef } from "react";

function HalftoneTitle({ id, children }) {
  const titleRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const title = titleRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!title || !canvas || !context) return undefined;

    const rootStyles = getComputedStyle(document.documentElement);
    const colors = {
      paper: rootStyles.getPropertyValue("--color-paper").trim(),
      cobalt: rootStyles.getPropertyValue("--color-cobalt").trim(),
    };
    const cellSize = Number.parseFloat(rootStyles.getPropertyValue("--halftone-cell-size")) || 18;
    const revealRadius = Number.parseFloat(rootStyles.getPropertyValue("--halftone-reveal-radius")) || 180;
    const state = { width: 0, height: 0, points: [], pointer: { x: 0, y: 0, active: false }, visible: true, frame: 0 };
    const canTrackPointer = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const draw = () => {
      if (!state.width || !state.height) return;
      context.clearRect(0, 0, state.width, state.height);
      context.fillStyle = colors.cobalt;
      context.fillRect(0, 0, state.width, state.height);
      context.fillStyle = colors.paper;

      state.points.forEach((point) => {
        const distance = Math.hypot(point.x - state.pointer.x, point.y - state.pointer.y);
        const proximity = state.pointer.active ? Math.max(0, 1 - distance / revealRadius) : 0;
        const eased = proximity * proximity * (3 - 2 * proximity);
        const radius = cellSize * (0.78 - eased * 0.63);
        context.beginPath();
        context.arc(point.x, point.y, radius, 0, Math.PI * 2);
        context.fill();
      });
    };

    const resize = () => {
      const bounds = title.getBoundingClientRect();
      const scale = Math.min(window.devicePixelRatio || 1, 1.5);
      state.width = Math.max(1, bounds.width);
      state.height = Math.max(1, bounds.height);
      canvas.width = Math.round(state.width * scale);
      canvas.height = Math.round(state.height * scale);
      context.setTransform(scale, 0, 0, scale, 0, 0);
      state.points = [];
      for (let y = cellSize / 2; y < state.height + cellSize; y += cellSize) {
        for (let x = cellSize / 2; x < state.width + cellSize; x += cellSize) state.points.push({ x, y });
      }
      draw();
    };

    const requestDraw = () => {
      if (state.frame || !state.visible) return;
      state.frame = window.requestAnimationFrame(() => { state.frame = 0; draw(); });
    };
    const onPointerMove = (event) => {
      if (!canTrackPointer()) return;
      const bounds = title.getBoundingClientRect();
      state.pointer = { x: event.clientX - bounds.left, y: event.clientY - bounds.top, active: true };
      requestDraw();
    };
    const onPointerLeave = () => { state.pointer.active = false; requestDraw(); };
    const resizeObserver = new ResizeObserver(resize);
    const intersectionObserver = new IntersectionObserver(([entry]) => { state.visible = entry.isIntersecting; if (state.visible) draw(); }, { threshold: 0.01 });

    resizeObserver.observe(title);
    intersectionObserver.observe(title);
    title.addEventListener("pointermove", onPointerMove, { passive: true });
    title.addEventListener("pointerleave", onPointerLeave, { passive: true });
    resize();
    return () => {
      if (state.frame) window.cancelAnimationFrame(state.frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      title.removeEventListener("pointermove", onPointerMove);
      title.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return <h1 className="cover-title cover-title--halftone" id={id} ref={titleRef}><canvas ref={canvasRef} className="halftone-title__canvas" aria-hidden="true" /><span className="cover-title__text">{children}</span></h1>;
}

export default HalftoneTitle;

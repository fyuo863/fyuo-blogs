import { useEffect, useRef } from "react";

const LENS_DURATION = 520;

function GenerativeField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    const context = canvas?.getContext("2d");

    if (!canvas || !host || !context) return undefined;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const supportsFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const rootStyles = getComputedStyle(document.documentElement);
    const colors = {
      paper: rootStyles.getPropertyValue("--color-paper-soft").trim(),
      coral: rootStyles.getPropertyValue("--color-coral").trim(),
      cobalt: rootStyles.getPropertyValue("--color-cobalt").trim(),
    };
    const cellSize = Number.parseFloat(rootStyles.getPropertyValue("--field-cell-size")) || 38;
    const fieldOpacity = Number.parseFloat(rootStyles.getPropertyValue("--field-opacity")) || 0.09;
    const minDot = Number.parseFloat(rootStyles.getPropertyValue("--field-dot-min")) || 0.7;
    const maxDot = Number.parseFloat(rootStyles.getPropertyValue("--field-dot-max")) || 2.8;
    const dotOpacity = Number.parseFloat(rootStyles.getPropertyValue("--field-dot-opacity")) || 0.74;
    const baseLight = Number.parseFloat(rootStyles.getPropertyValue("--field-base-light")) || 0.3;
    const state = {
      width: 0,
      height: 0,
      points: [],
      visible: true,
      pointer: { x: 0, y: 0, active: false },
      lastMove: 0,
      frame: 0,
    };

    const canAnimate = () => supportsFinePointer.matches && !prefersReducedMotion.matches;

    const rebuildPoints = () => {
      const columns = Math.ceil(state.width / cellSize);
      const rows = Math.ceil(state.height / cellSize);
      const points = [];

      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          points.push({
            x: (column + 0.5) * cellSize,
            y: (row + 0.5) * cellSize,
          });
        }
      }

      state.points = points;
    };

    const drawMoire = () => {
      const diagonal = Math.hypot(state.width, state.height);

      [[colors.cobalt, -0.22], [colors.coral, 0.24]].forEach(([color, rotation], index) => {
        context.save();
        context.translate(state.width / 2, state.height / 2);
        context.rotate(rotation);
        context.strokeStyle = color;
        context.globalAlpha = fieldOpacity * 0.72;
        context.lineWidth = 0.65;

        for (let line = -diagonal; line <= diagonal; line += 17) {
          context.beginPath();
          for (let x = -diagonal; x <= diagonal; x += 18) {
            const y = line + Math.sin(x * 0.035 + index * 1.7) * 2.4;
            if (x === -diagonal) context.moveTo(x, y);
            else context.lineTo(x, y);
          }
          context.stroke();
        }
        context.restore();
      });
    };

    const draw = (time = 0) => {
      if (!state.width || !state.height) return;

      const lensActivity = state.pointer.active
        ? Math.max(0, 1 - (time - state.lastMove) / LENS_DURATION)
        : 0;
      const anchorX = state.width * 0.7;
      const anchorY = state.height * 0.54;
      const anchorRadius = Math.max(state.width, state.height) * 0.76;

      context.clearRect(0, 0, state.width, state.height);
      drawMoire();

      state.points.forEach((point) => {
        const anchorDistance = Math.hypot(point.x - anchorX, point.y - anchorY);
        const staticLight = Math.max(0, 1 - anchorDistance / anchorRadius);
        const pointerDistance = Math.hypot(point.x - state.pointer.x, point.y - state.pointer.y);
        const pointerLight = state.pointer.active
          ? Math.max(0, 1 - pointerDistance / 230)
          : 0;
        const brightness = Math.min(
          1,
          baseLight * staticLight + Math.pow(pointerLight, 2.2) * lensActivity,
        );
        const radius = minDot + brightness * (maxDot - minDot);

        context.beginPath();
        context.fillStyle = colors.paper;
        context.globalAlpha = dotOpacity;
        context.arc(
          point.x,
          point.y,
          radius,
          0,
          Math.PI * 2,
        );
        context.fill();
      });

      context.globalAlpha = 1;
    };

    const stopFrame = () => {
      if (state.frame) window.cancelAnimationFrame(state.frame);
      state.frame = 0;
    };

    const requestDraw = () => {
      if (state.frame || !state.visible || document.hidden || !canAnimate()) return;
      state.frame = window.requestAnimationFrame((time) => {
        state.frame = 0;
        draw(time);
        if (state.pointer.active && time - state.lastMove < LENS_DURATION) requestDraw();
      });
    };

    const resize = () => {
      const bounds = host.getBoundingClientRect();
      const scale = Math.min(window.devicePixelRatio || 1, 1.5);
      state.width = Math.max(1, bounds.width);
      state.height = Math.max(1, bounds.height);
      canvas.width = Math.round(state.width * scale);
      canvas.height = Math.round(state.height * scale);
      context.setTransform(scale, 0, 0, scale, 0, 0);
      state.pointer.x = state.width * 0.68;
      state.pointer.y = state.height * 0.54;
      rebuildPoints();
      draw();
    };

    const onPointerMove = (event) => {
      if (!canAnimate()) return;
      const bounds = host.getBoundingClientRect();
      state.pointer.x = event.clientX - bounds.left;
      state.pointer.y = event.clientY - bounds.top;
      state.pointer.active = true;
      state.lastMove = performance.now();
      requestDraw();
    };

    const onPointerLeave = () => {
      state.pointer.active = false;
      draw();
    };

    const onVisibilityChange = () => {
      if (document.hidden) stopFrame();
      else if (state.pointer.active) requestDraw();
    };

    const resizeObserver = new ResizeObserver(resize);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      state.visible = entry.isIntersecting;
      if (!state.visible) stopFrame();
      else draw();
    }, { threshold: 0.01 });

    resizeObserver.observe(host);
    intersectionObserver.observe(host);
    host.addEventListener("pointermove", onPointerMove, { passive: true });
    host.addEventListener("pointerleave", onPointerLeave, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    resize();

    return () => {
      stopFrame();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      host.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return <canvas ref={canvasRef} className="generative-field" aria-hidden="true" />;
}

export default GenerativeField;

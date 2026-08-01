import { useEffect, useRef } from "react";

const RIPPLE_DURATION = 520;

function hash(value) {
  const sine = Math.sin(value * 12.9898) * 43758.5453;
  return sine - Math.floor(sine);
}

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
      acid: rootStyles.getPropertyValue("--color-acid").trim(),
      coral: rootStyles.getPropertyValue("--color-coral").trim(),
      cobalt: rootStyles.getPropertyValue("--color-cobalt").trim(),
    };
    const fieldOpacity = Number.parseFloat(rootStyles.getPropertyValue("--field-opacity")) || 0.09;
    const minDot = Number.parseFloat(rootStyles.getPropertyValue("--field-dot-min")) || 0.7;
    const maxDot = Number.parseFloat(rootStyles.getPropertyValue("--field-dot-max")) || 2.8;
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
      const area = state.width * state.height;
      const spacing = Math.max(34, Math.min(58, Math.sqrt(area / 270)));
      const columns = Math.ceil(state.width / spacing) + 2;
      const rows = Math.ceil(state.height / spacing) + 2;
      const points = [];

      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          const seed = row * 131 + column * 17;
          points.push({
            x: (column - 0.5) * spacing + (hash(seed) - 0.5) * spacing * 0.28,
            y: (row - 0.5) * spacing + (hash(seed + 1) - 0.5) * spacing * 0.28,
            phase: hash(seed + 2) * Math.PI * 2,
          });
        }
      }

      state.points = points;
    };

    const drawMoire = (time, activity) => {
      const diagonal = Math.hypot(state.width, state.height);
      const wave = activity * 8;
      const phase = time * 0.0025 * activity;

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
            const y = line + Math.sin(x * 0.035 + phase + index * 1.7) * wave;
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

      const activity = state.pointer.active
        ? Math.max(0, 1 - (time - state.lastMove) / RIPPLE_DURATION)
        : 0;

      context.clearRect(0, 0, state.width, state.height);
      drawMoire(time, activity);

      state.points.forEach((point) => {
        const distance = Math.hypot(point.x - state.pointer.x, point.y - state.pointer.y);
        const proximity = state.pointer.active ? Math.max(0, 1 - distance / 220) : 0;
        const ripple = Math.sin(time * 0.008 + point.phase) * proximity * activity;
        const radius = minDot + proximity * (maxDot - minDot) + Math.abs(ripple) * 0.8;

        context.beginPath();
        context.fillStyle = proximity > 0.1 ? colors.acid : colors.paper;
        context.globalAlpha = 0.18 + proximity * 0.66;
        context.arc(
          point.x + ripple * 8,
          point.y + ripple * 5,
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
        if (state.pointer.active && time - state.lastMove < RIPPLE_DURATION) requestDraw();
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

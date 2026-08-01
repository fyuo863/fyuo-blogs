import { Children, useEffect, useRef, useState } from "react";

function HalftoneTitle({ id, children }) {
  const titleRef = useRef(null);
  const canvasRef = useRef(null);
  const lines = Children.toArray(children).map((child) => (
    typeof child === "string" ? child : String(child.props?.children ?? "")
  ));
  const selectableCount = lines.join("").replace(/\s/g, "").length;
  const [selectedCharacter, setSelectedCharacter] = useState(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches || selectableCount < 2) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setSelectedCharacter((current) => (current + 1) % selectableCount);
    }, 1000);

    return () => window.clearInterval(interval);
  }, [selectableCount]);

  useEffect(() => {
    const title = titleRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    const surface = title?.closest(".home-cover");
    if (!title || !canvas || !context || !surface) return undefined;

    const rootStyles = getComputedStyle(document.documentElement);
    const colors = {
      paper: rootStyles.getPropertyValue("--color-paper").trim(),
      cobalt: rootStyles.getPropertyValue("--color-cobalt").trim(),
    };
    const cellSize = Number.parseFloat(rootStyles.getPropertyValue("--halftone-cell-size")) || 18;
    const revealRadius = Number.parseFloat(rootStyles.getPropertyValue("--halftone-reveal-radius")) || 180;
    const waveIntervalMin = Number.parseFloat(rootStyles.getPropertyValue("--halftone-wave-interval-min")) || 460;
    const waveIntervalMax = Number.parseFloat(rootStyles.getPropertyValue("--halftone-wave-interval-max")) || 1540;
    const waveSpeed = Number.parseFloat(rootStyles.getPropertyValue("--halftone-wave-speed")) || 0.14;
    const waveDamping = Number.parseFloat(rootStyles.getPropertyValue("--halftone-wave-damping")) || 0.992;
    const waveStrength = Number.parseFloat(rootStyles.getPropertyValue("--halftone-wave-strength")) || 1.65;
    const state = {
      width: 0,
      height: 0,
      titleBounds: { x: 0, y: 0, width: 0, height: 0 },
      points: [],
      pointer: { x: 0, y: 0, active: false },
      visible: true,
      frame: 0,
      animation: 0,
      lastFrame: 0,
      wave: null,
    };
    const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canTrackPointer = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches && !prefersReducedMotion();

    const injectWaveAt = (x, y, strength = waveStrength) => {
      const wave = state.wave;
      if (!wave) return;

      const sourceColumn = Math.max(1, Math.min(wave.columns - 2, Math.round((x - cellSize / 2) / cellSize) + 1));
      const sourceRow = Math.max(1, Math.min(wave.rows - 2, Math.round((y - cellSize / 2) / cellSize) + 1));
      for (let row = Math.max(1, sourceRow - 3); row <= Math.min(wave.rows - 2, sourceRow + 3); row += 1) {
        for (let column = Math.max(1, sourceColumn - 3); column <= Math.min(wave.columns - 2, sourceColumn + 3); column += 1) {
          const distance = Math.hypot(column - sourceColumn, row - sourceRow);
          if (distance > 3.5) continue;
          wave.current[row * wave.columns + column] -= (1 - distance / 3.5) * strength;
        }
      }
    };

    const injectWave = (timestamp) => {
      const wave = state.wave;
      if (!wave || timestamp < wave.nextImpulse) return;

      wave.lastImpulse = timestamp;
      wave.nextImpulse = timestamp + waveIntervalMin + Math.random() * (waveIntervalMax - waveIntervalMin);
      const sourceRow = 2 + Math.round(((Math.sin(timestamp / 620) + 1) / 2) * (wave.rows - 5));
      injectWaveAt(cellSize / 2, sourceRow * cellSize - cellSize / 2);
    };

    const advanceWave = (timestamp) => {
      const wave = state.wave;
      if (!wave) return;
      injectWave(timestamp);

      for (let row = 1; row < wave.rows - 1; row += 1) {
        for (let column = 1; column < wave.columns - 1; column += 1) {
          const index = row * wave.columns + column;
          const laplacian = wave.current[index - 1] + wave.current[index + 1] + wave.current[index - wave.columns] + wave.current[index + wave.columns] - 4 * wave.current[index];
          const edgeDistance = Math.min(row, column, wave.rows - 1 - row, wave.columns - 1 - column);
          const edgeDamping = edgeDistance < 4 ? 0.94 + edgeDistance * 0.014 : 1;
          wave.next[index] = (2 * wave.current[index] - wave.previous[index] + laplacian * waveSpeed) * waveDamping * edgeDamping;
        }
      }

      [wave.previous, wave.current, wave.next] = [wave.current, wave.next, wave.previous];
      wave.next.fill(0);
    };

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
        const waveHeight = state.wave?.current[point.waveIndex] || 0;
        const withinTitle = point.x >= state.titleBounds.x && point.x <= state.titleBounds.x + state.titleBounds.width && point.y >= state.titleBounds.y && point.y <= state.titleBounds.y + state.titleBounds.height;
        const baseRadius = withinTitle ? 0.39 : 0.78;
        const radius = cellSize * Math.max(0.12, Math.min(0.96, baseRadius - eased * 0.63 + waveHeight * 0.27));
        context.beginPath();
        context.arc(point.x, point.y, radius, 0, Math.PI * 2);
        context.fill();
      });
    };

    const resize = () => {
      const bounds = surface.getBoundingClientRect();
      const titleBox = title.getBoundingClientRect();
      const scale = Math.min(window.devicePixelRatio || 1, 1.5);
      state.width = Math.max(1, bounds.width);
      state.height = Math.max(1, bounds.height);
      state.titleBounds = {
        x: titleBox.left - bounds.left,
        y: titleBox.top - bounds.top,
        width: titleBox.width,
        height: titleBox.height,
      };
      canvas.width = Math.round(state.width * scale);
      canvas.height = Math.round(state.height * scale);
      context.setTransform(scale, 0, 0, scale, 0, 0);
      state.points = [];
      const columns = Math.ceil(state.width / cellSize) + 2;
      const rows = Math.ceil(state.height / cellSize) + 2;
      state.wave = {
        columns,
        rows,
        previous: new Float32Array(columns * rows),
        current: new Float32Array(columns * rows),
        next: new Float32Array(columns * rows),
        lastImpulse: Number.NEGATIVE_INFINITY,
        nextImpulse: 0,
      };
      let row = 1;
      for (let y = cellSize / 2; y < state.height + cellSize; y += cellSize) {
        let column = 1;
        for (let x = cellSize / 2; x < state.width + cellSize; x += cellSize) {
          state.points.push({ x, y, waveIndex: row * columns + column });
          column += 1;
        }
        row += 1;
      }
      draw();
    };

    const requestDraw = () => {
      if (state.frame || !state.visible) return;
      state.frame = window.requestAnimationFrame(() => { state.frame = 0; draw(); });
    };
    const onPointerMove = (event) => {
      if (!canTrackPointer()) return;
      const bounds = surface.getBoundingClientRect();
      state.pointer = { x: event.clientX - bounds.left, y: event.clientY - bounds.top, active: true };
      requestDraw();
    };
    const onPointerLeave = () => { state.pointer.active = false; requestDraw(); };
    const onPointerDown = (event) => {
      if (prefersReducedMotion()) return;
      const bounds = surface.getBoundingClientRect();
      injectWaveAt(event.clientX - bounds.left, event.clientY - bounds.top, waveStrength * 1.2);
      requestDraw();
    };
    const animate = (timestamp) => {
      if (!state.visible || prefersReducedMotion()) {
        state.animation = 0;
        return;
      }
      if (state.lastFrame) advanceWave(timestamp);
      state.lastFrame = timestamp;
      draw();
      state.animation = window.requestAnimationFrame(animate);
    };
    const startAnimation = () => {
      if (!state.animation && state.visible && !prefersReducedMotion()) {
        state.lastFrame = 0;
        state.animation = window.requestAnimationFrame(animate);
      }
    };
    const resizeObserver = new ResizeObserver(resize);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      state.visible = entry.isIntersecting;
      if (state.visible) {
        draw();
        startAnimation();
      }
    }, { threshold: 0.01 });

    resizeObserver.observe(surface);
    resizeObserver.observe(title);
    intersectionObserver.observe(surface);
    surface.addEventListener("pointermove", onPointerMove, { passive: true });
    surface.addEventListener("pointerleave", onPointerLeave, { passive: true });
    surface.addEventListener("pointerdown", onPointerDown, { passive: true });
    resize();
    startAnimation();
    return () => {
      if (state.frame) window.cancelAnimationFrame(state.frame);
      if (state.animation) window.cancelAnimationFrame(state.animation);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      surface.removeEventListener("pointermove", onPointerMove);
      surface.removeEventListener("pointerleave", onPointerLeave);
      surface.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  let sequenceIndex = 0;
  return (
    <h1 className="cover-title cover-title--halftone" id={id} ref={titleRef}>
      <canvas ref={canvasRef} className="halftone-title__canvas" aria-hidden="true" />
      <span className="cover-title__text">
        {lines.map((line, lineIndex) => (
          <span className="cover-title__line" key={`${line}-${lineIndex}`}>
            {Array.from(line).map((character, characterIndex) => {
              const index = character.trim() ? sequenceIndex++ : -1;
              return <span className={`halftone-title__character${index === selectedCharacter ? " is-selected" : ""}`} key={`${character}-${characterIndex}`}>{character || "\u00a0"}</span>;
            })}
          </span>
        ))}
      </span>
    </h1>
  );
}

export default HalftoneTitle;

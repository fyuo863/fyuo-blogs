import { Children, useEffect, useRef, useState } from "react";

function HalftoneTitle({ id, children, as: Heading = 'h1' }) {
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
    }, 500);

    return () => window.clearInterval(interval);
  }, [selectableCount]);

  useEffect(() => {
    const title = titleRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    const surface = title?.closest(".home-cover, .studio-keyvisual");
    if (!title || !canvas || !context || !surface) return undefined;

    const isPreview = new URLSearchParams(window.location.search).get('__plugin_preview') === '1';
    const frameInterval = 1000 / (isPreview ? 15 : 60);
    const pixelBudget = isPreview ? 180000 : 1200000;
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const rootStyles = getComputedStyle(surface);
    const colors = {
      get paper() { return rootStyles.getPropertyValue("--color-paper").trim(); },
      get cobalt() { return rootStyles.getPropertyValue("--color-cobalt").trim(); },
    };
    const baseCellSize = Number.parseFloat(rootStyles.getPropertyValue("--halftone-cell-size")) || 18;
    let cellSize = baseCellSize;
    let viewportScale = 1;
    const baseRadius = Number.parseFloat(rootStyles.getPropertyValue("--halftone-base-radius")) || 0.78;
    const titleDotScale = Number.parseFloat(rootStyles.getPropertyValue("--halftone-title-dot-scale")) || 0.5;
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
      pointer: { x: 0, y: 0, clientX: 0, clientY: 0, active: false },
      visible: true,
      frame: 0,
      animation: 0,
      lastFrame: 0,
      wave: null,
      simulationTime: 0,
    };
    const prefersReducedMotion = () => motionQuery.matches;
    const canTrackPointer = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches && !prefersReducedMotion();
    const updatePointerPosition = (clientX, clientY) => {
      const bounds = surface.getBoundingClientRect();
      state.pointer = { x: clientX - bounds.left, y: clientY - bounds.top, clientX, clientY, active: true };
    };

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
      context.fillStyle = colors.cobalt;
      context.fillRect(0, 0, state.width, state.height);
      context.fillStyle = colors.paper;

      context.beginPath();
      state.points.forEach((point) => {
        const distance = state.pointer.active ? Math.hypot(point.x - state.pointer.x, point.y - state.pointer.y) : 0;
        const proximity = state.pointer.active ? Math.max(0, 1 - distance / (revealRadius * viewportScale)) : 0;
        const eased = proximity * proximity * (3 - 2 * proximity);
        const waveHeight = state.wave?.current[point.waveIndex] || 0;
        const radius = cellSize * Math.max(0.12, Math.min(0.96, point.baseRadius - eased * 0.63 + waveHeight * 0.27));
        context.moveTo(point.x + radius, point.y);
        context.arc(point.x, point.y, radius, 0, Math.PI * 2);
      });
      context.fill();
    };

    const resize = () => {
      const bounds = surface.getBoundingClientRect();
      const titleBox = title.getBoundingClientRect();
      state.width = Math.max(1, bounds.width);
      state.height = Math.max(1, bounds.height);
      // Preserve dot proportions while bounding the grid on large displays.
      viewportScale = Math.max(1, state.width / 1280, state.height / 800);
      cellSize = baseCellSize * viewportScale;
      state.titleBounds = {
        x: titleBox.left - bounds.left,
        y: titleBox.top - bounds.top,
        width: titleBox.width,
        height: titleBox.height,
      };
      if (state.pointer.active) updatePointerPosition(state.pointer.clientX, state.pointer.clientY);
      const scale = Math.min(window.devicePixelRatio || 1, 1.5, Math.sqrt(pixelBudget / (state.width * state.height)));
      canvas.width = Math.max(1, Math.floor(state.width * scale));
      canvas.height = Math.max(1, Math.floor(state.height * scale));
      context.setTransform(canvas.width / state.width, 0, 0, canvas.height / state.height, 0, 0);
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
      for (let y = cellSize / 2; y < state.height + cellSize; y += cellSize) {
        const row = Math.max(1, Math.min(rows - 2, Math.round((y - cellSize / 2) / cellSize) + 1));
        for (let x = cellSize / 2; x < state.width + cellSize; x += cellSize) {
          const withinTitle = x >= state.titleBounds.x && x <= state.titleBounds.x + state.titleBounds.width && y >= state.titleBounds.y && y <= state.titleBounds.y + state.titleBounds.height;
          const column = Math.max(1, Math.min(columns - 2, Math.round((x - cellSize / 2) / cellSize) + 1));
          state.points.push({
            x,
            y,
            baseRadius: baseRadius * (withinTitle ? titleDotScale : 1),
            waveIndex: row * columns + column,
          });
        }
      }
      draw();
    };

    const requestDraw = () => {
      if (state.animation || state.frame || !state.visible || document.hidden) return;
      state.frame = window.requestAnimationFrame(() => { state.frame = 0; draw(); });
    };
    const onPointerMove = (event) => {
      if (isPreview || !state.visible || !canTrackPointer()) return;
      updatePointerPosition(event.clientX, event.clientY);
      requestDraw();
    };
    const onScroll = () => {
      if (!state.pointer.active) return;
      updatePointerPosition(state.pointer.clientX, state.pointer.clientY);
      requestDraw();
    };
    const onWindowBlur = () => { state.pointer.active = false; requestDraw(); };
    const onPointerDown = (event) => {
      if (prefersReducedMotion()) return;
      const bounds = surface.getBoundingClientRect();
      injectWaveAt(event.clientX - bounds.left, event.clientY - bounds.top, waveStrength * 1.2);
      requestDraw();
    };
    const animate = (timestamp) => {
      if (!state.visible || document.hidden || prefersReducedMotion()) {
        state.animation = 0;
        return;
      }
      if (!state.lastFrame || timestamp - state.lastFrame >= frameInterval - 0.5) {
        // Fixed simulation steps keep wave speed independent of preview/display FPS.
        if (!state.simulationTime) state.simulationTime = timestamp;
        state.simulationTime = Math.max(state.simulationTime, timestamp - 100);
        while (timestamp - state.simulationTime >= 1000 / 60) {
          state.simulationTime += 1000 / 60;
          advanceWave(state.simulationTime);
        }
        state.lastFrame = timestamp;
        draw();
      }
      state.animation = window.requestAnimationFrame(animate);
    };
    const startAnimation = () => {
      if (!state.animation && state.visible && !document.hidden && !prefersReducedMotion()) {
        if (state.frame) { window.cancelAnimationFrame(state.frame); state.frame = 0; }
        state.simulationTime = 0;
        state.lastFrame = 0;
        state.animation = window.requestAnimationFrame(animate);
      }
    };
    const onActivityChange = () => {
      if (document.hidden || prefersReducedMotion()) {
        window.cancelAnimationFrame(state.animation);
        window.cancelAnimationFrame(state.frame);
        state.animation = state.frame = 0;
        if (!document.hidden) requestDraw();
      } else startAnimation();
    };
    document.addEventListener('visibilitychange', onActivityChange);
    motionQuery.addEventListener('change', onActivityChange);
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
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("blur", onWindowBlur);
    surface.addEventListener("pointerdown", onPointerDown, { passive: true });
    resize();
    startAnimation();
    return () => {
      if (state.frame) window.cancelAnimationFrame(state.frame);
      if (state.animation) window.cancelAnimationFrame(state.animation);
      document.removeEventListener('visibilitychange', onActivityChange);
      motionQuery.removeEventListener('change', onActivityChange);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("blur", onWindowBlur);
      surface.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  let sequenceIndex = 0;
  return (
    <Heading className="cover-title cover-title--halftone" id={id} ref={titleRef}>
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
    </Heading>
  );
}

export default HalftoneTitle;

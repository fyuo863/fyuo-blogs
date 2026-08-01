import { useEffect, useRef } from "react";
import { usePresence } from "framer-motion";
import Matter from "matter-js";

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function randomSign() {
  return Math.random() > 0.5 ? 1 : -1;
}

const EVENT_NAME = "fyuo:route-physics-start";

const FALL_DURATION = 1900;
const EXIT_FALLBACK_DELAY = 700;

// 重力加速度：数值越大，下坠越快
const GRAVITY_Y = 2.4;
const GRAVITY_SCALE = 0.001;

export default function PhysicsPage({ children }) {
  const pageRef = useRef(null);
  const [isPresent, safeToRemove] = usePresence();

  const animationRef = useRef(null);
  const fallbackTimerRef = useRef(null);
  const engineRef = useRef(null);
  const startedRef = useRef(false);
  const safeToRemoveRef = useRef(safeToRemove);

  useEffect(() => {
    safeToRemoveRef.current = safeToRemove;
  }, [safeToRemove]);

  useEffect(() => {
    const cleanupPhysics = () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }

      if (fallbackTimerRef.current) {
        clearTimeout(fallbackTimerRef.current);
        fallbackTimerRef.current = null;
      }

      if (engineRef.current) {
        Matter.Engine.clear(engineRef.current);
        engineRef.current = null;
      }
    };

    const startPhysics = () => {
      if (startedRef.current) return;

      const page = pageRef.current;

      if (!page) {
        safeToRemoveRef.current?.();
        return;
      }

      const elements = Array.from(
        page.querySelectorAll("[data-physics-item='true']")
      );

      if (elements.length === 0) {
        safeToRemoveRef.current?.();
        return;
      }

      startedRef.current = true;

      if (fallbackTimerRef.current) {
        clearTimeout(fallbackTimerRef.current);
        fallbackTimerRef.current = null;
      }

      const Engine = Matter.Engine;
      const Bodies = Matter.Bodies;
      const Body = Matter.Body;
      const Composite = Matter.Composite;

      const engine = Engine.create({
        gravity: {
          x: 0,
          y: GRAVITY_Y,
          scale: GRAVITY_SCALE,
        },
      });

      engineRef.current = engine;

      const pageRect = page.getBoundingClientRect();

      page.style.pointerEvents = "none";

      const physicsObjects = elements.map((el) => {
        const rect = el.getBoundingClientRect();

        const width = Math.max(rect.width, 8);
        const height = Math.max(rect.height, 8);

        const centerX = rect.left - pageRect.left + width / 2;
        const centerY = rect.top - pageRect.top + height / 2;

        const strength = Number(el.dataset.physicsStrength || 1);

        const body = Bodies.rectangle(centerX, centerY, width, height, {
          restitution: 0,
          friction: 0,
          frictionAir: randomBetween(0.002, 0.01),
          density: 0.001 * strength,

          // 不互相碰撞：每个 UI 块独立自由坠落
          collisionFilter: {
            group: -1,
            category: 0x0001,
            mask: 0x0000,
          },
        });

        // 随机方向初速度
        Body.setVelocity(body, {
          x: randomBetween(-7.5, 7.5) * strength,
          y: randomBetween(-7.5, 2.5) * strength,
        });

        // 随机角速度，持续旋转
        Body.setAngularVelocity(
          body,
          randomSign() * randomBetween(0.035, 0.14) * strength
        );

        el.style.willChange = "transform, opacity";
        el.style.transformOrigin = "center center";
        el.style.pointerEvents = "none";
        el.style.position = "relative";
        el.style.zIndex = "40";

        return {
          el,
          body,
          startX: centerX,
          startY: centerY,
        };
      });

      Composite.add(
        engine.world,
        physicsObjects.map((item) => item.body)
      );

      let lastTime = performance.now();
      const startTime = performance.now();

      const update = (now) => {
        const delta = Math.min(now - lastTime, 1000 / 30);
        lastTime = now;

        Engine.update(engine, delta);

        const elapsed = now - startTime;
        const progress = Math.min(elapsed / FALL_DURATION, 1);

        physicsObjects.forEach(({ el, body, startX, startY }) => {
          const dx = body.position.x - startX;
          const dy = body.position.y - startY;
          const rotate = body.angle;

          const opacity = 1 - Math.max(0, progress - 0.75) / 0.25;

          el.style.transform = `
            translate3d(${dx}px, ${dy}px, 0)
            rotate(${rotate}rad)
          `;
          el.style.opacity = String(Math.max(0, opacity));
        });

        if (elapsed < FALL_DURATION) {
          animationRef.current = requestAnimationFrame(update);
        } else {
          cleanupPhysics();
          safeToRemoveRef.current?.();
        }
      };

      animationRef.current = requestAnimationFrame(update);
    };

    const handleStart = () => {
      if (isPresent) return;
      startPhysics();
    };

    window.addEventListener(EVENT_NAME, handleStart);

    return () => {
      window.removeEventListener(EVENT_NAME, handleStart);
      cleanupPhysics();
    };
  }, [isPresent]);

  useEffect(() => {
    if (isPresent) return;

    // 旧页面已经进入退出态，但不立刻掉落；
    // 等 App.jsx 在“新页面加载完/首帧渲染后”发事件。
    // 如果事件没有发过来，超时兜底。
    fallbackTimerRef.current = setTimeout(() => {
      window.dispatchEvent(new CustomEvent(EVENT_NAME));
    }, EXIT_FALLBACK_DELAY);

    return () => {
      if (fallbackTimerRef.current) {
        clearTimeout(fallbackTimerRef.current);
        fallbackTimerRef.current = null;
      }
    };
  }, [isPresent]);

  return (
    <main
      ref={pageRef}
      className={`page-shell ${
        isPresent ? "relative z-10" : "absolute inset-x-0 top-0 z-30"
      }`}
    >
      {children}
    </main>
  );
}

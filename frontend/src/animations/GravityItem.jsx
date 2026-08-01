import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function randomSign() {
  return Math.random() > 0.5 ? 1 : -1;
}

export default function GravityItem({
  children,
  className = "",
  delay = 0,
  as: Component = motion.div,
}) {
  const shouldReduceMotion = useReducedMotion();

  const physics = useMemo(() => {
    const viewportHeight =
      typeof window !== "undefined" ? window.innerHeight : 900;

    const vx = randomBetween(-280, 280);
    const initialVy = randomBetween(-180, 80);
    const gravityFall = randomBetween(
      viewportHeight * 0.95,
      viewportHeight * 1.5
    );

    return {
      x: vx,
      initialVy,
      y: initialVy + gravityFall,
      spin: randomSign() * randomBetween(720, 1440),
      delay: delay + randomBetween(0, 0.08),
      originX: randomBetween(0.12, 0.88),
      originY: randomBetween(0.12, 0.88),
    };
  }, [delay]);

  if (shouldReduceMotion) {
    return (
      <Component
        className={className}
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        {children}
      </Component>
    );
  }

  return (
    <Component
      className={className}
      style={{
        willChange: "transform, opacity",
      }}
      initial={{
        x: 0,
        y: 0,
        opacity: 1,
      }}
      animate={{
        x: 0,
        y: 0,
        opacity: 1,
      }}
      exit={{
        x: [0, physics.x * 0.4, physics.x],
        y: [0, physics.initialVy, physics.y],
        opacity: [1, 1, 0],
      }}
      transition={{
        duration: 1.15,
        delay: physics.delay,
        times: [0, 0.32, 1],
        ease: ["easeOut", "easeIn"],
      }}
    >
      <motion.div
        style={{
          transformOrigin: `${physics.originX * 100}% ${physics.originY * 100}%`,
          willChange: "transform",
        }}
        initial={{
          rotate: 0,
        }}
        animate={{
          rotate: 0,
        }}
        exit={{
          rotate: physics.spin,
        }}
        transition={{
          duration: 1.15,
          delay: physics.delay,
          ease: "linear",
        }}
      >
        {children}
      </motion.div>
    </Component>
  );
}
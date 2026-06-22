import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
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

    const vx = randomBetween(-260, 260);
    const initialVy = randomBetween(-180, 70);
    const gravityFall = randomBetween(
      viewportHeight * 0.85,
      viewportHeight * 1.35
    );

    return {
      x: vx,
      initialVy,
      y: initialVy + gravityFall,
      rotate: randomBetween(-28, 28),
      delay: delay + randomBetween(0, 0.08),
      originX: randomBetween(0.2, 0.8),
      originY: randomBetween(0.2, 0.8),
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
        transformOrigin: `${physics.originX * 100}% ${physics.originY * 100}%`,
        willChange: "transform, opacity",
      }}
      initial={{
        x: 0,
        y: 0,
        rotate: 0,
        opacity: 1,
      }}
      animate={{
        x: 0,
        y: 0,
        rotate: 0,
        opacity: 1,
      }}
      exit={{
        x: [0, physics.x * 0.38, physics.x],
        y: [0, physics.initialVy, physics.y],
        rotate: [0, physics.rotate * 0.45, physics.rotate],
        opacity: [1, 1, 0],
      }}
      transition={{
        duration: 1.05,
        delay: physics.delay,
        times: [0, 0.32, 1],
        ease: ["easeOut", "easeIn"],
      }}
    >
      {children}
    </Component>
  );
}
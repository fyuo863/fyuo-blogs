import { motion, useReducedMotion } from "framer-motion";

export default function GravityPage({ children }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.main
      className="relative min-h-screen bg-black"
      initial={
        shouldReduceMotion
          ? { opacity: 1 }
          : {
              opacity: 0,
              y: 18,
              scale: 0.985,
            }
      }
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      exit={{
        opacity: 1,
      }}
      transition={{
        duration: shouldReduceMotion ? 0.15 : 0.42,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.main>
  );
}
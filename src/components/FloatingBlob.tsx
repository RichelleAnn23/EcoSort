import { motion } from "framer-motion";

interface FloatingBlobProps {
  delay?: number;
  duration?: number;
  size?: number;
  color?: string;
  x?: string;
  y?: string;
}

const FloatingBlob = ({ 
  delay = 0, 
  duration = 8, 
  size = 300, 
  color = "hsl(150 95% 37% / 0.15)",
  x = "0%",
  y = "0%"
}: FloatingBlobProps) => {
  return (
    <motion.div
      className="absolute rounded-full blur-3xl pointer-events-none"
      style={{
        width: size,
        height: size,
        background: color,
        left: x,
        top: y,
      }}
      animate={{
        y: [0, -30, 0],
        x: [0, 20, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: duration,
        delay: delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
};

export default FloatingBlob;

import { motion } from "framer-motion";

interface FloatingRecycleIconProps {
  delay?: number;
  duration?: number;
  x?: string;
  y?: string;
}

const FloatingRecycleIcon = ({ 
  delay = 0, 
  duration = 10, 
  x = "20%",
  y = "30%"
}: FloatingRecycleIconProps) => {
  return (
    <motion.div
      className="absolute pointer-events-none opacity-10"
      style={{
        left: x,
        top: y,
      }}
      animate={{
        y: [0, -50, 0],
        x: [0, 30, 0],
        rotate: [0, 15, -15, 0],
      }}
      transition={{
        duration: duration,
        delay: delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <img
        src="/EcoSortLogo1.png"
        alt="EcoSort"
        className="w-16 h-16 object-contain"
      />
    </motion.div>
  );
};

export default FloatingRecycleIcon;

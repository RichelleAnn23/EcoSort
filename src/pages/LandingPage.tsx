import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Leaf, Recycle, TrendingUp, TreePine, Zap, Shield, Globe } from "lucide-react";
import FloatingBlob from "@/components/FloatingBlob";
import FloatingRecycleIcon from "@/components/FloatingRecycleIcon";
import Footer from "@/components/Footer";
import ThemeToggle from "@/components/ThemeToggle";

// Simple count-up component for animating numbers to a target value with optional suffix.
const CountUp: React.FC<{ value: string; duration?: number }> = ({ value, duration = 1200 }) => {
  // If the value isn't a simple number (e.g., contains a slash like 24/7), don't animate.
  if (value.includes('/')) {
    return <>{value}</>;
  }

  const match = value.match(/^([0-9]*\.?[0-9]+)/);
  const numericPart = match ? parseFloat(match[1]) : NaN;
  const suffix = value.slice(match ? match[1].length : 0);

  const [display, setDisplay] = useState<string>(match ? `0${suffix}` : value);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isFinite(numericPart)) {
      setDisplay(value);
      return;
    }

    const start = performance.now();
    const from = 0;
    const to = numericPart;

    const step = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / duration);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      const current = Math.round(from + (to - from) * eased);
      setDisplay(`${current}${suffix}`);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [duration, numericPart, suffix, value]);

  return <>{display}</>;
};

const LandingPage = () => {
  const navigate = useNavigate();

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const stats = [
    {
      value: "99%",
      label: "Accuracy",
      icon: TrendingUp,
      color: "#046241"
    },
    {
      value: "50K+",
      label: "Waste Items Sorted",
      icon: Recycle,
      color: "#133020"
    },
    {
      value: "24/7",
      label: "AI Monitoring",
      icon: Leaf,
      color: "#046241"
    }
  ];

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Real-time waste classification powered by advanced AI algorithms",
      color: "#FFB347"
    },
    {
      icon: Shield,
      title: "99% Accurate",
      description: "Industry-leading accuracy in waste detection and sorting",
      color: "#046241"
    },
    {
      icon: Globe,
      title: "Eco-Friendly",
      description: "Reducing carbon footprint through intelligent waste management",
      color: "#133020"
    },
    {
      icon: TreePine,
      title: "Sustainable",
      description: "Contributing to a greener planet, one item at a time",
      color: "#046241"
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <ThemeToggle />
      {/* Animated Background (matched to main page) */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-50 via-amber-50 to-emerald-50 dark:from-background dark:via-background dark:to-secondary" />
        <FloatingBlob delay={0} duration={8} size={400} x="10%" y="20%" color="hsl(150 95% 37% / 0.15)" />
        <FloatingBlob delay={2} duration={10} size={350} x="70%" y="50%" color="hsl(35 100% 72% / 0.1)" />
        <FloatingBlob delay={4} duration={12} size={300} x="40%" y="70%" color="hsl(150 95% 37% / 0.1)" />

        {/* Floating Recycle Icons */}
        <FloatingRecycleIcon delay={0} duration={12} x="15%" y="15%" />
        <FloatingRecycleIcon delay={3} duration={15} x="85%" y="25%" />
        <FloatingRecycleIcon delay={6} duration={10} x="50%" y="60%" />
        <FloatingRecycleIcon delay={9} duration={13} x="25%" y="75%" />
        <FloatingRecycleIcon delay={12} duration={11} x="75%" y="80%" />
      </div>

      <div className="relative z-10 px-4 py-16 md:py-24">
        <motion.div
          className="text-center max-w-6xl mx-auto mb-24"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            variants={fadeInUp}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="mb-6"
          >
            <motion.h1
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight text-emerald-900 dark:text-white"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
            >
              <span className="text-emerald-900 dark:text-white">EcoSort</span>{" "}
              <span style={{ color: "#FFB347" }}>AI</span>
            </motion.h1>
          </motion.div>

          <motion.p
            className="text-xl md:text-2xl lg:text-3xl mb-4 max-w-4xl mx-auto font-medium text-emerald-900 dark:text-white"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
          >
            Transform waste management with <span style={{ color: "#FFB347" }}>AI-powered</span> sorting technology.
          </motion.p>

          <motion.p
            className="text-lg md:text-xl mb-12 max-w-3xl mx-auto text-emerald-800/80 dark:text-white/80"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.7, delay: 0.6, ease: "easeOut" }}
          >
            Sustainable, intelligent, and designed for a <span style={{ color: "#FFB347" }}>cleaner planet</span>.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.7, delay: 0.7, ease: "easeOut" }}
          >
            <motion.div
              whileHover={{ y: -1, scale: 1.02, boxShadow: "0 8px 22px rgba(255, 179, 71, 0.35)" }}
              whileTap={{ scale: 0.99 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
            >
              <Button
                size="lg"
                onClick={() => navigate('/app')}
                className="group px-10 py-7 text-lg font-semibold rounded-2xl shadow-xl border-none transition-all duration-500 ease-out ring-2 ring-[#FFB347]/40 hover:ring-[#FFB347]/60 focus-visible:ring-[#FFB347] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background transform-gpu will-change-transform"
                style={{
                  background: "linear-gradient(135deg, #FFB347 0%, #FFC370 100%)",
                  color: "#133020",
                  backdropFilter: "blur(10px)"
                }}
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 ease-out group-hover:translate-x-1" />
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        <div className="my-10 h-px w-full bg-gradient-to-r from-transparent via-emerald-900/15 to-transparent dark:via-white/20" />

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-24"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.7, delay: 0.9, ease: "easeOut" }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 1 + index * 0.12, ease: "easeOut" }}
              whileHover={{ y: -6, scale: 1.02, rotateX: -2, rotateY: 2 }}
              whileTap={{ scale: 0.995 }}
              style={{ transformPerspective: 800 }}
              className="group"
            >
              <Card
                className="p-8 md:p-10 text-center ring-1 ring-white/40 hover:ring-white/50 dark:ring-emerald-300/20 dark:hover:ring-emerald-300/30 shadow-xl transition-all duration-300 ease-out rounded-3xl bg-white/70 dark:bg-emerald-400/10"
                style={{
                  backdropFilter: "blur(12px)",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)"
                }}
              >
                <motion.div
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-5 bg-amber-100/50 dark:bg-emerald-900/30 transform-gpu transition-all duration-300 ease-out group-hover:-translate-y-1 group-hover:rotate-6 group-hover:scale-105"
                >
                  <stat.icon className="h-8 w-8 text-[#046241] dark:text-[#FFB347]" />
                </motion.div>
                <h3
                  className="text-5xl md:text-6xl font-bold mb-3 text-[#1e736c] dark:text-[#FFB347]"
                >
                  <CountUp value={stat.value} />
                </h3>
                <p className="font-medium text-lg text-emerald-900 dark:text-[#FFB347]">
                  {stat.label}
                </p>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="max-w-7xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.7, delay: 1.3, ease: "easeOut" }}
        >
          <motion.div
            className="text-center mb-16"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.7, delay: 1.4, ease: "easeOut" }}
          >
            <h2
              className="text-4xl md:text-5xl font-bold mb-4 text-emerald-900 dark:text-white"
            >
              Why Choose EcoSort AI?
            </h2>
            <div className="mx-auto h-[3px] w-24 rounded-full bg-gradient-to-r from-emerald-300/70 via-amber-300/70 to-emerald-400/70" />
            <p
              className="text-lg md:text-xl max-w-2xl mx-auto text-emerald-800/80 dark:text-white/80"
            >
              Cutting-edge technology meets <span style={{ color: "#FFB347" }}>environmental responsibility</span>
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.5 + index * 0.1, ease: "easeOut" }}
                whileHover={{ y: -6, scale: 1.02, rotateX: -2, rotateY: 2 }}
                whileTap={{ scale: 0.995 }}
                style={{ transformPerspective: 800 }}
                className="group"
              >
                <Card
                  className="p-6 ring-1 ring-white/40 hover:ring-white/50 dark:ring-emerald-300/20 dark:hover:ring-emerald-300/30 shadow-lg transition-all duration-300 ease-out rounded-2xl h-full bg-white/70 dark:bg-emerald-400/10"
                  style={{
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    boxShadow: "0 4px 24px rgba(0, 0, 0, 0.12)"
                  }}
                >
                  <motion.div
                    className="w-14 h-14 rounded-xl mb-4 flex items-center justify-center transform-gpu transition-all duration-300 ease-out group-hover:-translate-y-1 group-hover:rotate-6 group-hover:scale-105"
                    style={{
                      background: "transparent"
                    }}
                  >
                    <feature.icon className="h-7 w-7 text-[#046241] dark:text-[#FFB347]" />
                  </motion.div>
                  <h3
                    className="text-xl font-bold mb-2 text-[#133020] dark:text-[#FFB347]"
                  >
                    {feature.title}
                  </h3>
                  <p className="text-[#046241]/80 dark:text-[#FFB347]">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default LandingPage;

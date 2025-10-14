import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Leaf, Recycle, TrendingUp, Sparkles, TreePine, Zap, Shield, Globe } from "lucide-react";

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

  const floatingIcons = [
    { Icon: Leaf, delay: 0, duration: 8, x: [0, 30, 0], y: [0, -50, 0], left: "10%", top: "15%" },
    { Icon: Recycle, delay: 1, duration: 10, x: [0, -40, 0], y: [0, 60, 0], left: "85%", top: "20%" },
    { Icon: Sparkles, delay: 0.5, duration: 7, x: [0, 25, 0], y: [0, -40, 0], left: "15%", top: "70%" },
    { Icon: TreePine, delay: 2, duration: 9, x: [0, -30, 0], y: [0, 50, 0], left: "80%", top: "65%" },
    { Icon: Leaf, delay: 1.5, duration: 11, x: [0, 35, 0], y: [0, -45, 0], left: "50%", top: "10%" },
    { Icon: Sparkles, delay: 2.5, duration: 8, x: [0, -25, 0], y: [0, 55, 0], left: "90%", top: "50%" }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: `linear-gradient(135deg, #F5EEDB 0%, #F9F7F7 50%, #FFFFFF 100%)`
    }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingIcons.map((config, idx) => (
          <motion.div
            key={idx}
            className="absolute opacity-20"
            style={{ left: config.left, top: config.top }}
            animate={{
              x: config.x,
              y: config.y
            }}
            transition={{
              duration: config.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: config.delay
            }}
          >
            <config.Icon className="w-16 h-16" style={{ color: "#046241" }} />
          </motion.div>
        ))}
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full blur-3xl opacity-30"
          style={{ background: "#046241", top: "-10%", left: "-5%" }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full blur-3xl opacity-30"
          style={{ background: "#FFB347", top: "40%", right: "-10%" }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.35, 0.2]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16 md:py-24">
        <motion.div
          className="text-center max-w-6xl mx-auto mb-24"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            variants={fadeInUp}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6"
          >
            <motion.h1
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <span style={{ color: "#133020" }}>EcoSort AI</span>
              <span className="text-gray-700"> – </span>
              <span style={{ color: "#046241" }}>Smart Waste</span>{" "}
              <span style={{ color: "#FFB347" }}>Detection</span>
              <br />
              <span style={{ color: "#133020" }}>for a Greener Future</span>
            </motion.h1>
          </motion.div>

          <motion.p
            className="text-xl md:text-2xl lg:text-3xl mb-4 max-w-4xl mx-auto font-medium"
            style={{ color: "#046241" }}
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Transform waste management with AI-powered sorting technology.
          </motion.p>

          <motion.p
            className="text-lg md:text-xl mb-12 max-w-3xl mx-auto"
            style={{ color: "#133020", opacity: 0.8 }}
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Sustainable, intelligent, and designed for a cleaner planet.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <motion.div
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(255, 179, 71, 0.6)" }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                onClick={() => navigate('/app')}
                className="px-10 py-7 text-lg font-semibold rounded-2xl shadow-xl border-none transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg, #FFB347 0%, #FFC370 100%)",
                  color: "#133020",
                  backdropFilter: "blur(10px)"
                }}
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                className="px-10 py-7 text-lg font-semibold rounded-2xl shadow-lg transition-all duration-300"
                style={{
                  background: "rgba(255, 255, 255, 0.4)",
                  backdropFilter: "blur(10px)",
                  border: "2px solid rgba(4, 98, 65, 0.3)",
                  color: "#133020"
                }}
              >
                Learn More
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-24"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 + index * 0.15 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <Card
                className="p-8 md:p-10 text-center border-none shadow-xl transition-all duration-300 rounded-3xl"
                style={{
                  background: "rgba(255, 255, 255, 0.6)",
                  backdropFilter: "blur(12px)",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)"
                }}
              >
                <motion.div
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-5"
                  style={{
                    background: `linear-gradient(135deg, ${stat.color} 0%, ${stat.color}dd 100%)`,
                    boxShadow: `0 4px 20px ${stat.color}40`
                  }}
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <stat.icon className="h-8 w-8 text-white" />
                </motion.div>
                <h3
                  className="text-5xl md:text-6xl font-bold mb-3"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </h3>
                <p className="font-medium text-lg" style={{ color: "#133020" }}>
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
          transition={{ duration: 0.8, delay: 1.3 }}
        >
          <motion.div
            className="text-center mb-16"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            <h2
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ color: "#133020" }}
            >
              Why Choose EcoSort AI?
            </h2>
            <p
              className="text-lg md:text-xl max-w-2xl mx-auto"
              style={{ color: "#046241", opacity: 0.8 }}
            >
              Cutting-edge technology meets environmental responsibility
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.5 + index * 0.1 }}
                whileHover={{ y: -10, scale: 1.03 }}
              >
                <Card
                  className="p-6 border-none shadow-lg transition-all duration-300 rounded-2xl h-full"
                  style={{
                    background: "rgba(255, 255, 255, 0.5)",
                    backdropFilter: "blur(10px)",
                    boxShadow: "0 4px 24px rgba(0, 0, 0, 0.08)"
                  }}
                >
                  <motion.div
                    className="w-14 h-14 rounded-xl mb-4 flex items-center justify-center"
                    style={{
                      background: `${feature.color}15`,
                      border: `2px solid ${feature.color}30`
                    }}
                    whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <feature.icon className="h-7 w-7" style={{ color: feature.color }} />
                  </motion.div>
                  <h3
                    className="text-xl font-bold mb-2"
                    style={{ color: "#133020" }}
                  >
                    {feature.title}
                  </h3>
                  <p style={{ color: "#046241", opacity: 0.8 }}>
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;


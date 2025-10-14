import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Leaf, Recycle, TrendingUp } from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const stats = [
    {
      value: "99%",
      label: "Accuracy",
      icon: TrendingUp,
      gradient: "from-teal-600 to-teal-800"
    },
    {
      value: "50K+",
      label: "Waste Items Sorted",
      icon: Recycle,
      gradient: "from-emerald-600 to-emerald-800"
    },
    {
      value: "24/7",
      label: "AI Monitoring",
      icon: Leaf,
      gradient: "from-green-600 to-green-800"
    }
  ];

  return (
    <div className="min-h-screen bg-[#EDE8DC] relative overflow-hidden">
      {/* Decorative floating blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-emerald-200/30 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 left-1/3 w-80 h-80 bg-teal-200/30 rounded-full blur-3xl"
          animate={{
            x: [0, 40, 0],
            y: [0, -40, 0],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        {/* Hero Section */}
        <motion.div
          className="text-center max-w-5xl mx-auto mb-20"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.6 }}
        >
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            variants={fadeIn}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="text-teal-900">EcoSort AI</span>
            {" – "}
            <span className="text-emerald-700">Smart Waste</span>{" "}
            <span className="text-yellow-600">Detection</span>
            <br />
            <span className="text-teal-800">for a Greener Future</span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-gray-700 mb-4 max-w-3xl mx-auto"
            variants={fadeIn}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Transform waste management with AI-powered sorting technology.
          </motion.p>

          <motion.p
            className="text-lg md:text-xl text-gray-600 mb-10 max-w-3xl mx-auto"
            variants={fadeIn}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Sustainable, intelligent, and designed for a cleaner planet.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            variants={fadeIn}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button
              size="lg"
              onClick={() => navigate('/app')}
              className="bg-[#F59E42] hover:bg-[#E68A2E] text-white px-8 py-6 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-gray-400 text-gray-700 hover:bg-gray-200 px-8 py-6 text-lg rounded-2xl bg-white/50 backdrop-blur-sm"
            >
              Learn More
            </Button>
          </motion.div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={fadeIn}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
            >
              <Card className="p-8 text-center bg-white/60 backdrop-blur-sm border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-3xl">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br ${stat.gradient} mb-4`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className={`text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent`}>
                  {stat.value}
                </h3>
                <p className="text-gray-700 font-medium text-lg">
                  {stat.label}
                </p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;

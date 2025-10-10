import { motion } from "framer-motion";
import { Leaf, AlertTriangle, Sparkles, Info } from "lucide-react";

const tips = [
  {
    icon: Leaf,
    title: "Eco Tip",
    message: "Sort your recyclables to reduce waste pollution and help create a sustainable future.",
    gradient: "from-primary/20 to-primary/5",
    borderColor: "border-primary/30",
  },
  {
    icon: AlertTriangle,
    title: "Important",
    message: "Non-recyclables must be properly disposed to prevent contamination of recyclable materials.",
    gradient: "from-accent/20 to-accent/5",
    borderColor: "border-accent/30",
  },
  {
    icon: Sparkles,
    title: "Did You Know?",
    message: "Recycling one aluminum can saves enough energy to power a TV for 3 hours!",
    gradient: "from-primary/15 to-accent/10",
    borderColor: "border-primary/20",
  },
  {
    icon: Info,
    title: "Pro Tip",
    message: "Clean and dry recyclables before disposal to ensure they can be properly processed.",
    gradient: "from-accent/15 to-primary/10",
    borderColor: "border-accent/20",
  },
];

const EducationalSection = () => {
  return (
    <div className="space-y-4">
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-center mb-8 text-gradient-eco"
      >
        Learn & Make a Difference
      </motion.h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tips.map((tip, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className={`backdrop-blur-xl bg-gradient-to-br ${tip.gradient} rounded-2xl p-6 border ${tip.borderColor} transition-all duration-300`}
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-background/50">
                <tip.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2 text-foreground">
                  {tip.title}
                </h3>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  {tip.message}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default EducationalSection;

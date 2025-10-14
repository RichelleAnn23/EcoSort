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
            className={`group backdrop-blur-xl rounded-2xl p-6 border transition-all duration-300 bg-[#f3ede1]/90 border-amber-300/40 dark:bg-card/40 dark:border-border`}
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-white/70 dark:bg-emerald-900/30 ring-1 ring-amber-300/40 dark:ring-white/10 transform-gpu transition-all duration-300 ease-out group-hover:-translate-y-1 group-hover:rotate-6 group-hover:scale-105">
                <tip.icon className="w-6 h-6 text-[#046241] dark:text-[#FFB347]" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2 text-emerald-900 dark:text-foreground">
                  {tip.title}
                </h3>
                <p className="text-sm leading-relaxed text-emerald-900/80 dark:text-foreground/80">
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

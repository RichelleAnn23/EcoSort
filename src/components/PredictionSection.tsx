import { motion } from "framer-motion";
import { Recycle, Trash2, Lightbulb, HelpCircle } from "lucide-react";

interface PredictionSectionProps {
  prediction: string;
  confidence: number;
  tip: string;
  isPredicting?: boolean;
  isClutter?: boolean;
}

const PredictionSection = ({ prediction, confidence, tip, isPredicting = false, isClutter = false }: PredictionSectionProps) => {
  const isRecyclable = prediction.toLowerCase().includes("recyclable") && !prediction.toLowerCase().includes("non");
  const isInitialState = prediction === "Point camera at waste";
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="backdrop-blur-xl rounded-3xl p-8 border glow-eco bg-[#f3ede1]/80 border-amber-300/40 dark:bg-card/40 dark:border-border"
    >
      {/* Classification Result */}
      <div className="flex items-center gap-4 mb-6">
        <motion.div 
          className={`p-4 rounded-2xl ${
            isInitialState || isClutter ? 'bg-muted/50' : 
            isRecyclable ? 'bg-primary/20' : 'bg-accent/20'
          }`}
          animate={{ 
            scale: isPredicting ? [1, 1.05, 1] : 1,
            opacity: isPredicting ? [0.8, 1, 0.8] : 1
          }}
          transition={{ 
            duration: isPredicting ? 1.5 : 0.5, 
            repeat: isPredicting ? Infinity : 0 
          }}
        >
          {isClutter ? (
            <HelpCircle className="w-8 h-8 text-amber-500" />
          ) : isInitialState ? (
            <Lightbulb className="w-8 h-8 text-muted-foreground" />
          ) : isRecyclable ? (
            <Recycle className="w-8 h-8 text-primary" />
          ) : (
            <Trash2 className="w-8 h-8 text-accent" />
          )}
        </motion.div>
        <div>
          <p className="text-sm mb-1 text-emerald-900 dark:text-muted-foreground">
            {isPredicting ? 'Analyzing...' : 'Classification'}
          </p>
          <h3 className={`text-3xl font-bold ${
            isInitialState || isClutter ? 'text-muted-foreground' : 
            isRecyclable ? 'text-primary' : 'text-accent'
          }`}>
            {isInitialState ? 'Ready to Scan' : prediction}
          </h3>
        </div>
      </div>
      
      {/* Confidence Bar */}
      <div className="space-y-2 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-emerald-900 dark:text-muted-foreground">
            {isPredicting ? 'Analyzing...' : 'Confidence Level'}
          </span>
          <span className="font-semibold text-foreground">
            {isInitialState ? '—' : `${confidence}%`}
          </span>
        </div>
        <div className="relative h-3 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ 
              width: isInitialState ? '0%' : isPredicting ? '100%' : `${confidence}%`,
              // Only animate opacity when actively predicting, otherwise keep it solid
              opacity: isPredicting ? [0.6, 1, 0.6] : 1
            }}
            transition={isPredicting ? {
              duration: 1.5,
              repeat: Infinity,
              repeatType: 'reverse'
            } : {
              duration: 0.8,
              ease: "easeOut"
            }}
            className={`absolute top-0 left-0 h-full rounded-full ${
              isRecyclable ? 'bg-primary' : 'bg-accent'
            }`}
          />
        </div>
      </div>
      {/* Recycling Tip */}
      <motion.div 
        className="mt-6 p-4 bg-foreground/5 rounded-2xl border border-border"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-start gap-3">
          {isClutter ? (
            <HelpCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-amber-500" />
          ) : (
            <Lightbulb className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
              isInitialState ? 'text-muted-foreground' : 'text-amber-500'
            }`} />
          )}
          <div>
            <p className="font-medium mb-1 text-emerald-900 dark:text-foreground/90">
              {isInitialState ? 'Tip' : isClutter ? 'Tip' : 'Did you know?'}
            </p>
            <p className="text-sm text-emerald-900/80 dark:text-muted-foreground">
              {isPredicting ? 'Analyzing the waste item...' : tip}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PredictionSection;

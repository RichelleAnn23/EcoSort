import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Recycle, Trash2, Activity, HelpCircle } from "lucide-react";

interface StatsSectionProps {
  recyclableCount: number;
  nonRecyclableCount: number;
  lastLabel?: string;
  lastProbability?: number; // 0-100
  lastDetectedAt?: string; // ISO string
  isPredicting?: boolean;
  isClutter?: boolean;
  // New: captured thumbnails per category
  recyclableImages?: string[];
  nonRecyclableImages?: string[];
  // New: click handlers to show stacked gallery
  onShowRecyclable?: () => void;
  onShowNonRecyclable?: () => void;
  // New: hide counters during animation
  hideCounters?: boolean;
}

const AnimatedCounter = ({ value }: { value: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 1000; // 1 second
    const increment = end / (duration / 16); // 60fps

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{count}</span>;
};

const StatsSection = ({
  recyclableCount,
  nonRecyclableCount,
  lastLabel,
  lastProbability = 0,
  lastDetectedAt,
  isPredicting = false,
  isClutter = false,
  recyclableImages = [],
  nonRecyclableImages = [],
  onShowRecyclable,
  onShowNonRecyclable,
  hideCounters = false
}: StatsSectionProps) => {
  const probability = Math.max(0, Math.min(100, lastProbability));
  const formattedTime = lastDetectedAt ? new Date(lastDetectedAt).toLocaleTimeString() : "—";
  const labelLower = (lastLabel || '').toLowerCase();
  const hasLabel = !!lastLabel;
  const isRecyclableLabel = hasLabel && labelLower.includes('recyclable') && !labelLower.includes('non');

  // Status styling: gray for clutter, green for recyclable, yellow for non-recyclable
  const statusBadgeClasses = isClutter
    ? 'bg-gray-100/20 text-gray-500 border-gray-400/40 dark:bg-gray-800/20 dark:text-gray-400'
    : (hasLabel
        ? (isRecyclableLabel
            ? 'bg-emerald-100/20 text-emerald-500 border-emerald-400/40'
            : 'bg-amber-100/20 text-amber-600 border-amber-400/40')
        : (isPredicting
            ? 'bg-primary/15 text-primary border-primary/30'
            : 'bg-muted text-muted-foreground border-border'));

  const statusIconColor = isClutter
    ? 'text-gray-500 dark:text-gray-400'
    : (hasLabel
        ? (isRecyclableLabel ? 'text-emerald-500' : 'text-amber-500')
        : (isPredicting ? 'text-primary' : 'text-muted-foreground'));

  // Choose icon: HelpCircle for clutter, Activity for normal
  const StatusIcon = isClutter ? HelpCircle : Activity;

  const Thumb = ({ src, idx, onClick }: { src: string; idx: number; onClick?: () => void }) => (
    <img
      key={`${src.slice(0,24)}-${idx}`}
      src={src}
      alt="Captured item"
      className="h-10 w-10 object-cover rounded-md border border-border flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
      loading="lazy"
      onClick={onClick}
    />
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {/* Recyclable Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        whileHover={{ scale: 1.05, boxShadow: "0 0 25px hsl(150 95% 37% / 0.4)" }}
        className="backdrop-blur-xl rounded-2xl p-6 border transition-all duration-300 cursor-pointer bg-[#f3ede1]/80 border-amber-300/40 dark:bg-card/40 dark:border-primary/30 hover:border-primary"
      >
        <div className="flex items-center gap-4 mb-3">
          <div className="p-3 rounded-xl bg-primary/20">
            <Recycle className="w-8 h-8 text-primary" />
          </div>
          <div>
            <p className="text-sm mb-1 text-emerald-900 dark:text-muted-foreground">♻️ Recyclable Items</p>
            {!hideCounters && (
              <p className="text-4xl font-bold text-primary">
                <AnimatedCounter value={recyclableCount} />
              </p>
            )}
          </div>
        </div>
        {recyclableImages.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pr-1" onClick={onShowRecyclable}>
            {recyclableImages.map((src, idx) => (
              <Thumb src={src} idx={idx} onClick={onShowRecyclable} />
            ))}
          </div>
        )}
      </motion.div>

      {/* Non-Recyclable Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        whileHover={{ scale: 1.05, boxShadow: "0 0 25px hsl(35 100% 72% / 0.4)" }}
        className="backdrop-blur-xl rounded-2xl p-6 border transition-all duration-300 cursor-pointer bg-[#f3ede1]/80 border-amber-300/40 dark:bg-card/40 dark:border-accent/30 hover:border-accent"
      >
        <div className="flex items-center gap-4 mb-3">
          <div className="p-3 rounded-xl bg-accent/20">
            <Trash2 className="w-8 h-8 text-accent" />
          </div>
          <div>
            <p className="text-sm mb-1 text-emerald-900 dark:text-muted-foreground">❌ Non-Recyclable Items</p>
            {!hideCounters && (
              <p className="text-4xl font-bold text-accent">
                <AnimatedCounter value={nonRecyclableCount} />
              </p>
            )}
          </div>
        </div>
        {nonRecyclableImages.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pr-1" onClick={onShowNonRecyclable}>
            {nonRecyclableImages.map((src, idx) => (
              <Thumb src={src} idx={idx} onClick={onShowNonRecyclable} />
            ))}
          </div>
        )}
      </motion.div>

      {/* Live Detection Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="sm:col-span-2 backdrop-blur-xl rounded-2xl p-6 border glow-eco bg-[#f3ede1]/80 border-amber-300/40 dark:bg-card/40 dark:border-border"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <StatusIcon className={`w-5 h-5 ${statusIconColor}`} />
            <p className="text-sm text-emerald-900 dark:text-muted-foreground">Status</p>
          </div>
          {/* Hide Non-Recyclable badge when clutter is detected */}
          {!isClutter && (
            <motion.span
              className={`text-xs font-semibold px-3 py-1 rounded-full border ${statusBadgeClasses}`}
              animate={isPredicting || hasLabel ? { opacity: [0.8, 1, 0.8] } : { opacity: 1 }}
              transition={{ duration: 1.2, repeat: isPredicting || hasLabel ? Infinity : 0 }}
            >
              {hasLabel ? (isRecyclableLabel ? 'Recyclable' : 'Non-Recyclable') : (isPredicting ? 'Analyzing' : 'Idle')}
            </motion.span>
          )}
          {isClutter && (
            <motion.span
              className={`text-xs font-semibold px-3 py-1 rounded-full border ${statusBadgeClasses}`}
            >
              Ready to Scan
            </motion.span>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm mb-1 text-emerald-900 dark:text-muted-foreground">Last Detected</p>
            <p className="text-lg font-semibold text-foreground">{lastLabel || '—'}</p>
            <p className="text-xs mt-1 text-emerald-900/80 dark:text-muted-foreground">{formattedTime}</p>
          </div>

          <div className="md:col-span-2">
            {/* Show helpful message instead of confidence bar when clutter detected */}
            {isClutter ? (
              <div className="flex items-center gap-2 p-3 bg-amber-100/10 dark:bg-amber-900/10 border border-amber-400/30 rounded-lg">
                <HelpCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <p className="text-sm text-amber-600 dark:text-amber-400">
                  Try adjusting your camera angle or position the waste item clearly in the frame for accurate detection.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-emerald-900 dark:text-muted-foreground">Confidence</p>
                  <p className="text-sm font-semibold text-foreground">{probability}%</p>
                </div>
                <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    key={probability}
                    initial={{ width: 0, opacity: 0.6 }}
                    animate={{ width: `${probability}%`, opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 0.8, repeat: isPredicting ? Infinity : 0, repeatType: 'reverse' }}
                    className={`absolute top-0 left-0 h-full rounded-full bg-gradient-to-r ${
                      hasLabel ? (isRecyclableLabel ? 'from-emerald-500 to-emerald-300' : 'from-amber-400 to-amber-200') : 'from-primary to-emerald-400'
                    }`}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StatsSection;

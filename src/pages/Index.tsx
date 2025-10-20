import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import FloatingBlob from "@/components/FloatingBlob";
import FloatingRecycleIcon from "@/components/FloatingRecycleIcon";
import WebcamSection from "@/components/WebcamSection";
import PredictionSection from "@/components/PredictionSection";
import StatsSection from "@/components/StatsSection";
import CapturedImages from "@/components/CapturedImages";
import EducationalSection from "@/components/EducationalSection";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import ThemeToggle from "@/components/ThemeToggle";

interface Prediction {
  className: string;
  probability: number;
}

const Index = () => {
  const navigate = useNavigate();
  // State for model predictions
  const [isPredicting, setIsPredicting] = useState(false);
  const [recyclableCount, setRecyclableCount] = useState(0);
  const [nonRecyclableCount, setNonRecyclableCount] = useState(0);
  const [currentPrediction, setCurrentPrediction] = useState("Point camera at waste");
  const [confidence, setConfidence] = useState(0);
  const [currentTip, setCurrentTip] = useState("Enable camera and point at waste items to classify them");
  const [isClutter, setIsClutter] = useState(false);

  // Live dashboard metadata
  const [lastLabel, setLastLabel] = useState<string | null>(null);
  const [lastProbability, setLastProbability] = useState<number>(0); // percent 0-100
  const [lastDetectedAt, setLastDetectedAt] = useState<string | null>(null);

  // Captured images per category
  const [recyclableImages, setRecyclableImages] = useState<string[]>([]);
  const [nonRecyclableImages, setNonRecyclableImages] = useState<string[]>([]);

  // Focus handling for CapturedImages when thumbnails in stats are clicked
  const [focusCategory, setFocusCategory] = useState<"recyclable" | "non" | undefined>(undefined);
  const [flashToken, setFlashToken] = useState(0);

  // Dropdown animation state
  const [showCapturedImages, setShowCapturedImages] = useState(false);

  const showRecyclable = () => {
    setFocusCategory("recyclable");
    setFlashToken((n) => n + 1);
    setShowCapturedImages(true);
  };
  const showNonRecyclable = () => {
    setFocusCategory("non");
    setFlashToken((n) => n + 1);
    setShowCapturedImages(true);
  };

  const handleBackToStats = () => {
    setShowCapturedImages(false);
  };

  const handleDeleteImage = useCallback((imageSrc: string) => {
    // Remove from recyclable images if found
    setRecyclableImages(prev => {
      const filtered = prev.filter(img => img !== imageSrc);
      if (filtered.length !== prev.length) {
        // Image was in recyclable, decrement counter
        setRecyclableCount(c => Math.max(0, c - 1));
        return filtered;
      }
      return prev;
    });

    // Remove from non-recyclable images if found
    setNonRecyclableImages(prev => {
      const filtered = prev.filter(img => img !== imageSrc);
      if (filtered.length !== prev.length) {
        // Image was in non-recyclable, decrement counter
        setNonRecyclableCount(c => Math.max(0, c - 1));
        return filtered;
      }
      return prev;
    });
  }, []);

  // Auto-scan stabilization to avoid double counting
  const lastLabelRef = useRef<string | null>(null);
  const lastCountTimeRef = useRef<number>(0);
  const COOLDOWN_MS = 1500;
  const THRESHOLD = 0.7;

  // Handle predictions from the model along with captured frame
  const handlePrediction = useCallback((predictions: Prediction[], frameDataUrl: string) => {
    if (predictions.length === 0) return;

    const topPrediction = predictions[0];
    const label = topPrediction.className.toLowerCase();
    const isRecyclable = label.includes('recyclable') && !label.includes('non');

    // Check if it's clutter or background
    const isClutterOrBackground = label.includes('clutter') || label.includes('background');
    setIsClutter(isClutterOrBackground);

    // Always show current prediction and confidence
    setCurrentPrediction(topPrediction.className);
    setConfidence(Math.round(topPrediction.probability * 100));

    // If clutter/background detected, show helpful message and update last detected
    if (isClutterOrBackground) {
      setCurrentTip("Please adjust your camera angle or position the waste item clearly in the frame for accurate detection.");
      // Update last detected to show clutter/background
      if (topPrediction.probability >= THRESHOLD) {
        setLastLabel(topPrediction.className);
        setLastProbability(Math.round(topPrediction.probability * 100));
        setLastDetectedAt(new Date().toISOString());
      }
      // Do not save clutter frames
      return; // Don't count or increment counters for clutter/background
    }

    // Update live dashboard metadata for each confident detection
    if (topPrediction.probability >= THRESHOLD) {
      setLastLabel(topPrediction.className);
      setLastProbability(Math.round(topPrediction.probability * 100));
      setLastDetectedAt(new Date().toISOString());
    }

    // Only count when: high confidence AND (label changed OR cooldown passed)
    if (topPrediction.probability >= THRESHOLD) {
      const now = Date.now();
      const labelChanged = lastLabelRef.current !== label;
      const cooldownPassed = now - lastCountTimeRef.current > COOLDOWN_MS;

      if (labelChanged || cooldownPassed) {
        if (isRecyclable) {
          setRecyclableCount(prev => prev + 1);
          setCurrentTip(getRecyclingTip(label));
          // Save captured frame under recyclable if present
          if (frameDataUrl) {
            setRecyclableImages(prev => {
              const next = [...prev, frameDataUrl];
              // keep last 12 to avoid memory bloat
              return next.slice(-12);
            });
          }
        } else {
          setNonRecyclableCount(prev => prev + 1);
          setCurrentTip("This item should be disposed of properly. Check local waste management guidelines.");
          if (frameDataUrl) {
            setNonRecyclableImages(prev => {
              const next = [...prev, frameDataUrl];
              return next.slice(-12);
            });
          }
        }

        lastLabelRef.current = label;
        lastCountTimeRef.current = now;
      }
    }
  }, []);

  // Helper function to get recycling tips based on the item type
  const getRecyclingTip = (itemType: string): string => {
    const tips: Record<string, string> = {
      'plastic': 'Rinse plastic containers before recycling. Remove caps and labels if required by your local facility.',
      'paper': 'Keep paper dry and clean. Remove any plastic windows or coatings before recycling.',
      'glass': 'Rinse glass containers and remove lids. Check if your local facility accepts mixed glass or requires separation by color.',
      'metal': 'Rinse cans and containers. Flatten aluminum cans to save space in your recycling bin.',
      'cardboard': 'Flatten cardboard boxes to save space. Remove any tape or plastic packaging.',
      'electronic': 'E-waste requires special handling. Look for local e-waste recycling programs.',
      'battery': 'Batteries should never go in regular trash. Use designated battery recycling drop-off locations.',
      'organic': 'Compost food scraps and yard waste to reduce landfill waste and create nutrient-rich soil.',
    };

    const item = itemType.toLowerCase();
    return tips[item] || 'Check local recycling guidelines for proper disposal instructions.';
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <ThemeToggle />
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-emerald-50 to-yellow-100 dark:from-background dark:via-background dark:to-secondary" />
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

      {/* Main Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="pt-16 pb-12 px-6 text-center"
        >
          <motion.h1 
            className="text-7xl md:text-9xl font-bold mb-6 text-emerald-900 dark:text-white flex items-center justify-center gap-2 cursor-pointer hover:opacity-95"
            onClick={() => navigate('/')}
            animate={{
              textShadow: [
                "0 0 16px hsl(35 100% 72% / 0.35)",
                "0 0 28px hsl(35 100% 72% / 0.25)",
                "0 0 16px hsl(35 100% 72% / 0.35)",
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <img src="/EcoSortLogo1.png" alt="EcoSort" className="w-32 h-32 md:w-48 md:h-48 object-contain" />
            <span className="text-emerald-900 dark:text-white">EcoSort</span>
            <span style={{ color: "#FFB347" }}>AI</span>
          </motion.h1>
        </motion.header>

        {/* Main Section - Split View */}
        <div className="container mx-auto px-6 pb-16">
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Left Panel - Webcam Section */}
            <WebcamSection 
              onPrediction={handlePrediction} 
              isPredicting={isPredicting}
              setIsPredicting={setIsPredicting}
            />

            {/* Right Panel - Prediction & Stats */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <PredictionSection 
                  prediction={currentPrediction} 
                  confidence={confidence} 
                  tip={currentTip}
                  isPredicting={isPredicting}
                  isClutter={isClutter}
                />
              </motion.div>

              {/* Animated Stats / Captured Images Container */}
              <div className="relative">
                <AnimatePresence mode="wait">
                  {!showCapturedImages ? (
                    <motion.div
                      key="stats"
                      initial={{ opacity: 1, y: 0 }}
                      exit={{
                        opacity: 0,
                        y: -20,
                        transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
                      }}
                    >
                      <StatsSection
                        recyclableCount={recyclableCount}
                        nonRecyclableCount={nonRecyclableCount}
                        lastLabel={lastLabel ?? undefined}
                        lastProbability={lastProbability}
                        lastDetectedAt={lastDetectedAt ?? undefined}
                        isPredicting={isPredicting}
                        isClutter={isClutter}
                        recyclableImages={recyclableImages}
                        nonRecyclableImages={nonRecyclableImages}
                        onShowRecyclable={showRecyclable}
                        onShowNonRecyclable={showNonRecyclable}
                        hideCounters={false}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="captured"
                      initial={{
                        opacity: 0,
                        y: 20,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        transition: {
                          duration: 0.6,
                          ease: [0.4, 0, 0.2, 1],
                          type: "spring",
                          stiffness: 120,
                          damping: 20
                        }
                      }}
                      exit={{
                        opacity: 0,
                        y: 20,
                        transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
                      }}
                    >
                      <CapturedImages
                        recyclableImages={recyclableImages}
                        nonRecyclableImages={nonRecyclableImages}
                        focusCategory={focusCategory}
                        flashToken={flashToken}
                        onBack={handleBackToStats}
                        onDeleteImage={handleDeleteImage}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Educational Section */}
          <EducationalSection />
        </div>

        {/* Footer */}
        <Footer />

        {/* Scroll to Top Button */}
        <ScrollToTop />
      </div>
    </div>
  );
};

export default Index;

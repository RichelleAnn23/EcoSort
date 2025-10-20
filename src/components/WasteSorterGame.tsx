import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, RotateCcw, Timer, Zap } from "lucide-react";

type Item = {
  id: string;
  name: string;
  emoji: string;
  category: "recycle" | "compost" | "trash" | "hazard";
};

const INITIAL_TIME = 60; // seconds
const STREAK_BONUS_THRESHOLD = 5;

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

const baseItems = (): Item[] => [
  { id: "1", name: "Plastic Bottle", emoji: "🥤", category: "recycle" },
  { id: "2", name: "Banana Peel", emoji: "🍌", category: "compost" },
  { id: "3", name: "Battery", emoji: "🔋", category: "hazard" },
  { id: "4", name: "Paper", emoji: "📄", category: "recycle" },
  { id: "5", name: "Glass Bottle", emoji: "🍾", category: "recycle" },
  { id: "6", name: "Pizza Box", emoji: "📦", category: "trash" },
  { id: "7", name: "Apple Core", emoji: "🍎", category: "compost" },
  { id: "8", name: "Light Bulb", emoji: "💡", category: "hazard" },
  { id: "9", name: "Aluminum Can", emoji: "🥫", category: "recycle" },
  { id: "10", name: "Coffee Grounds", emoji: "☕", category: "compost" },
  { id: "11", name: "Plastic Bag", emoji: "🛍️", category: "trash" },
  { id: "12", name: "Paint Can", emoji: "🎨", category: "hazard" },
  { id: "13", name: "Newspaper", emoji: "📰", category: "recycle" },
  { id: "14", name: "Eggshells", emoji: "🥚", category: "compost" },
  { id: "15", name: "Styrofoam", emoji: "📦", category: "trash" },
  { id: "16", name: "Phone", emoji: "📱", category: "hazard" },
];

export default function WasteSorterGame() {
  const [items, setItems] = useState<Item[]>(() => shuffle(baseItems()));
  const [visibleItems, setVisibleItems] = useState<Item[]>(() => items.slice(0, 6));
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [running, setRunning] = useState(true);
  const [feedback, setFeedback] = useState<{ type: "correct" | "wrong" | null; text?: string; itemId?: string }>({ type: null });
  const [draggedOver, setDraggedOver] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);
  const feedbackTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    setRunning(true);
    timerRef.current = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          if (timerRef.current) window.clearInterval(timerRef.current);
          setRunning(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      if (feedbackTimeoutRef.current) window.clearTimeout(feedbackTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (visibleItems.length < 6 && items.length > visibleItems.length) {
      const needed = 6 - visibleItems.length;
      const pool = items.filter((it) => !visibleItems.find((v) => v.id === it.id));
      setVisibleItems((cur) => [...cur, ...pool.slice(0, needed)]);
    }
  }, [items, visibleItems]);

  const bins = useMemo(
    () => [
      { key: "recycle", label: "Recycle", emoji: "♻️", color: "#06b6d4", darkColor: "#22d3ee" },
      { key: "compost", label: "Compost", emoji: "🌿", color: "#22c55e", darkColor: "#4ade80" },
      { key: "trash", label: "Trash", emoji: "🗑️", color: "#64748b", darkColor: "#94a3b8" },
      { key: "hazard", label: "Hazard", emoji: "⚠️", color: "#f43f5e", darkColor: "#fb7185" },
    ],
    []
  );

  function handleDragStart(e: React.DragEvent, id: string) {
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDrop(e: React.DragEvent, binKey: string) {
    e.preventDefault();
    setDraggedOver(null);
    const id = e.dataTransfer.getData("text/plain");
    if (!id) return;
    const item = visibleItems.find((it) => it.id === id);
    if (!item) return;

    const correct = item.category === binKey;
    if (correct) {
      const base = 10;
      const newStreak = streak + 1;
      const bonus = Math.floor(newStreak / STREAK_BONUS_THRESHOLD) * 5;
      setScore((s) => s + base + bonus);
      setStreak(newStreak);
      setFeedback({ type: "correct", text: `+${base + bonus} points!`, itemId: id });
    } else {
      setScore((s) => Math.max(0, s - 5));
      setStreak(0);
      setFeedback({ type: "wrong", text: `-5 points. Wrong bin!`, itemId: id });
    }

    setVisibleItems((v) => v.filter((it) => it.id !== id));
    setItems((pool) => pool.filter((it) => it.id !== id));

    if (feedbackTimeoutRef.current) window.clearTimeout(feedbackTimeoutRef.current);
    feedbackTimeoutRef.current = window.setTimeout(() => setFeedback({ type: null }), 1000);
  }

  function allowDrop(e: React.DragEvent) {
    e.preventDefault();
  }

  function handleDragEnter(binKey: string) {
    setDraggedOver(binKey);
  }

  function handleDragLeave() {
    setDraggedOver(null);
  }

  function restart() {
    if (timerRef.current) window.clearInterval(timerRef.current);
    if (feedbackTimeoutRef.current) window.clearTimeout(feedbackTimeoutRef.current);
    const fresh = shuffle(baseItems());
    setItems(fresh);
    setVisibleItems(fresh.slice(0, 6));
    setScore(0);
    setStreak(0);
    setTimeLeft(INITIAL_TIME);
    setFeedback({ type: null });
    setRunning(true);
    timerRef.current = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          if (timerRef.current) window.clearInterval(timerRef.current);
          setRunning(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }

  return (
    <div className="max-w-6xl mx-auto">
      <Card className="p-6 md:p-8 bg-white/80 dark:bg-emerald-900/20 backdrop-blur-lg border-2 border-emerald-200 dark:border-emerald-700 shadow-2xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Trophy className="h-6 w-6 text-[#FFB347]" />
              <div>
                <div className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">Score</div>
                <div className="text-3xl font-bold text-[#046241] dark:text-[#FFB347]">{score}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-500" />
              <div>
                <div className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">Streak</div>
                <div className="text-2xl font-bold text-[#133020] dark:text-white">{streak}</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Timer className={`h-5 w-5 ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-emerald-600 dark:text-emerald-400'}`} />
              <div className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-red-500' : 'text-[#046241] dark:text-[#FFB347]'}`}>
                {timeLeft}s
              </div>
            </div>
            <Button
              onClick={restart}
              size="lg"
              className="bg-gradient-to-r from-[#FFB347] to-[#FFC370] hover:from-[#FFC370] hover:to-[#FFB347] text-[#133020] font-semibold shadow-lg"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Restart
            </Button>
          </div>
        </div>

        {/* Feedback Message */}
        <AnimatePresence>
          {feedback.type && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`text-center py-3 px-6 rounded-xl mb-4 font-bold text-lg ${
                feedback.type === "correct"
                  ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300"
                  : "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300"
              }`}
            >
              {feedback.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Items Pool */}
        <div className="min-h-[180px] border-2 border-dashed border-emerald-300 dark:border-emerald-600 rounded-2xl p-4 mb-6 bg-gradient-to-br from-emerald-50/50 to-cyan-50/50 dark:from-emerald-950/30 dark:to-cyan-950/30">
          <div className="flex gap-4 flex-wrap justify-center items-center min-h-[150px]">
            {visibleItems.length === 0 && (
              <div className="text-center py-8">
                <div className="text-2xl mb-2">🎉</div>
                <div className="text-emerald-700 dark:text-emerald-300 font-medium">
                  {running ? "Sorting all items..." : "Game Over!"}
                </div>
              </div>
            )}
            <AnimatePresence>
              {visibleItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.5, rotate: 10 }}
                  transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
                  draggable={running}
                  onDragStart={(e) => handleDragStart(e, item.id)}
                  className={`w-28 h-28 rounded-2xl flex flex-col items-center justify-center bg-white dark:bg-emerald-800/40 shadow-lg border-2 border-emerald-200 dark:border-emerald-600 ${
                    running ? "cursor-grab active:cursor-grabbing hover:scale-105 hover:shadow-xl" : "cursor-not-allowed opacity-50"
                  } transition-all duration-200`}
                  whileHover={running ? { y: -5 } : {}}
                  whileTap={running ? { scale: 0.95 } : {}}
                >
                  <div className="text-4xl mb-1">{item.emoji}</div>
                  <div className="text-xs font-medium text-emerald-900 dark:text-emerald-100 text-center px-1">
                    {item.name}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Bins */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {bins.map((bin) => (
            <motion.div
              key={bin.key}
              onDragOver={allowDrop}
              onDrop={(e) => handleDrop(e, bin.key)}
              onDragEnter={() => handleDragEnter(bin.key)}
              onDragLeave={handleDragLeave}
              whileHover={{ scale: 1.02 }}
              className={`min-h-[140px] rounded-2xl flex flex-col items-center justify-center transition-all duration-300 border-3 ${
                draggedOver === bin.key
                  ? "scale-105 shadow-2xl border-4"
                  : "border-2"
              }`}
              style={{
                background: draggedOver === bin.key
                  ? `linear-gradient(135deg, ${bin.color}40, ${bin.color}20)`
                  : `linear-gradient(135deg, ${bin.color}20, ${bin.color}10)`,
                borderColor: bin.color,
              }}
            >
              <div className="text-5xl mb-2">{bin.emoji}</div>
              <div
                className="font-bold text-lg"
                style={{ color: bin.color }}
              >
                {bin.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Game Over Message */}
        {!running && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-center p-6 bg-gradient-to-r from-emerald-100 to-cyan-100 dark:from-emerald-900/40 dark:to-cyan-900/40 rounded-2xl border-2 border-emerald-300 dark:border-emerald-600"
          >
            <div className="text-3xl mb-2">🏆</div>
            <div className="text-2xl font-bold text-[#046241] dark:text-[#FFB347] mb-2">
              Time's Up!
            </div>
            <div className="text-xl text-emerald-700 dark:text-emerald-300">
              Final Score: <span className="font-bold">{score}</span>
            </div>
            {score >= 100 && (
              <div className="text-lg text-emerald-600 dark:text-emerald-400 mt-2">
                🌟 Amazing! You're a sorting master!
              </div>
            )}
          </motion.div>
        )}

        {/* Instructions */}
        <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-700">
          <div className="text-sm text-amber-900 dark:text-amber-200">
            <strong>How to play:</strong> Drag items into the correct bins before time runs out!
            Correct drops earn +10 points. Build a streak of {STREAK_BONUS_THRESHOLD} for bonus points!
            Wrong bins cost -5 points and reset your streak.
          </div>
        </div>
      </Card>
    </div>
  );
}


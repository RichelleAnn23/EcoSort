import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface CapturedImagesProps {
  recyclableImages: string[];
  nonRecyclableImages: string[];
  // Focus a category and flash it when user clicks thumbnails in Stats
  focusCategory?: 'recyclable' | 'non';
  flashToken?: number;
  // Back button to return to stats
  onBack?: () => void;
}

const Section = ({
  title,
  images,
  accentClass,
  containerRef,
  highlight,
  onImageClick
}: {
  title: string;
  images: string[];
  accentClass: string;
  containerRef?: React.RefObject<HTMLDivElement>;
  highlight?: boolean;
  onImageClick: (src: string) => void;
}) => (
  <motion.div
    ref={containerRef}
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35 }}
    className={`backdrop-blur-xl rounded-2xl p-4 border bg-[#f3ede1]/80 border-amber-300/40 dark:bg-card/40 dark:border-border ${
      highlight ? 'ring-2 ring-offset-2 ring-emerald-400/70 dark:ring-emerald-500/60' : ''
    }`}
  >
    <div className="flex items-center justify-between mb-3">
      <h4 className="text-sm font-semibold text-foreground">{title}</h4>
      <span className={`text-xs px-2 py-0.5 rounded-full border ${accentClass}`}>
        {images.length} scanned
      </span>
    </div>
    {images.length === 0 ? (
      <p className="text-xs text-muted-foreground">No images yet. Capture an item to see it here.</p>
    ) : (
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {images.map((src, idx) => (
          <button
            key={`${src.slice(0,24)}-${idx}`}
            type="button"
            className="focus:outline-none cursor-pointer"
            onClick={() => onImageClick(src)}
            aria-label="Open preview"
          >
            <img
              src={src}
              alt="Captured item"
              className="w-28 h-28 object-cover rounded-xl border border-border shadow-sm hover:opacity-90 transition-opacity"
              loading="lazy"
            />
          </button>
        ))}
      </div>
    )}
  </motion.div>
);

const CapturedImages = ({ recyclableImages, nonRecyclableImages, focusCategory, flashToken, onBack }: CapturedImagesProps) => {
  const recRef = useRef<HTMLDivElement>(null);
  const nonRef = useRef<HTMLDivElement>(null);
  const [recFlash, setRecFlash] = useState(false);
  const [nonFlash, setNonFlash] = useState(false);

  // Preview dialog state
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const handleImageClick = (src: string) => {
    setSelected(src);
    setOpen(true);
  };

  useEffect(() => {
    if (!flashToken) return;
    if (focusCategory === 'recyclable') {
      recRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setRecFlash(true);
      const t = setTimeout(() => setRecFlash(false), 1200);
      return () => clearTimeout(t);
    }
    if (focusCategory === 'non') {
      nonRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setNonFlash(true);
      const t = setTimeout(() => setNonFlash(false), 1200);
      return () => clearTimeout(t);
    }
  }, [flashToken, focusCategory]);

  return (
    <div className="space-y-4" id="captured-images">
      {/* Back Button */}
      {onBack && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          <Button
            onClick={onBack}
            variant="outline"
            size="sm"
            className="mb-2 backdrop-blur-xl bg-[#f3ede1]/80 border-amber-300/40 dark:bg-card/40 dark:border-border hover:bg-primary/10"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Stats
          </Button>
        </motion.div>
      )}

      <h3 className="text-base font-semibold text-foreground">Captured Images</h3>
      <Section
        title="♻️ Recyclable"
        images={recyclableImages}
        accentClass="border-emerald-400/40 text-emerald-600 dark:text-emerald-400"
        containerRef={recRef}
        highlight={recFlash}
        onImageClick={handleImageClick}
      />
      <Section
        title="❌ Non-Recyclable"
        images={nonRecyclableImages}
        accentClass="border-amber-400/40 text-amber-600 dark:text-amber-400"
        containerRef={nonRef}
        highlight={nonFlash}
        onImageClick={handleImageClick}
      />

      {/* Image Preview Dialog */}
      <Dialog open={open} onOpenChange={(v) => { if (!v) setSelected(null); setOpen(v); }}>
        <DialogContent className="max-w-3xl p-3">
          {selected && (
            <div className="w-full">
              <img src={selected} alt="Preview" className="w-full h-auto max-h-[80vh] object-contain rounded-lg" />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CapturedImages;

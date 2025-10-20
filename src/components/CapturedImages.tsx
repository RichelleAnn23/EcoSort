import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, Download, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import JSZip from "jszip";
import { saveAs } from "file-saver";

interface CapturedImagesProps {
  recyclableImages: string[];
  nonRecyclableImages: string[];
  // Focus a category and flash it when user clicks thumbnails in Stats
  focusCategory?: 'recyclable' | 'non';
  flashToken?: number;
  // Back button to return to stats
  onBack?: () => void;
  // Callback to update parent state when image is deleted
  onDeleteImage?: (imageSrc: string) => void;
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
      <h4 className="text-sm font-semibold text-emerald-900 dark:text-foreground">{title}</h4>
      <span className={`text-xs px-2 py-0.5 rounded-full border ${accentClass}`}>
        {images.length} scanned
      </span>
    </div>
    {images.length === 0 ? (
      <p className="text-xs text-black/70 dark:text-muted-foreground">No images yet. Capture an item to see it here.</p>
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

const CapturedImages = ({ recyclableImages, nonRecyclableImages, focusCategory, flashToken, onBack, onDeleteImage }: CapturedImagesProps) => {
  const recRef = useRef<HTMLDivElement>(null);
  const nonRef = useRef<HTMLDivElement>(null);
  const [recFlash, setRecFlash] = useState(false);
  const [nonFlash, setNonFlash] = useState(false);
  const [exporting, setExporting] = useState<{ recyclable: boolean; nonRecyclable: boolean }>({
    recyclable: false,
    nonRecyclable: false
  });

  // Preview dialog state
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const handleImageClick = (src: string) => {
    setSelected(src);
    setOpen(true);
  };

  const handleDeleteImage = () => {
    if (selected && onDeleteImage) {
      onDeleteImage(selected);
      setSelected(null);
      setOpen(false);
    }
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

  const exportImages = async (images: string[], category: 'recyclable' | 'nonRecyclable') => {
    if (!images || images.length === 0) return;

    setExporting(prev => ({ ...prev, [category]: true }));
    try {
      const zip = new JSZip();
      const folderName = category === 'recyclable' ? 'recyclable' : 'non-recyclable';
      const folder = zip.folder(folderName);

      if (!folder) {
        throw new Error('Failed to create folder');
      }

      await Promise.all(images.map(async (src, idx) => {
        try {
          const res = await fetch(src);
          const blob = await res.blob();
          const ext = (blob.type && blob.type.split('/')[1]) || 'jpg';
          folder.file(`${folderName}-${idx + 1}.${ext}`, blob);
        } catch (e) {
          console.error(`Failed to fetch image ${idx}:`, e);
        }
      }));

      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `${folderName}-images.zip`);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setExporting(prev => ({ ...prev, [category]: false }));
    }
  };

  const exportAllImages = async () => {
    const hasImages = recyclableImages.length > 0 || nonRecyclableImages.length > 0;
    if (!hasImages) return;

    setExporting(prev => ({ ...prev, recyclable: true, nonRecyclable: true }));
    try {
      const zip = new JSZip();

      // Add recyclable folder
      if (recyclableImages.length > 0) {
        const recFolder = zip.folder('recyclable');
        if (recFolder) {
          await Promise.all(recyclableImages.map(async (src, idx) => {
            try {
              const res = await fetch(src);
              const blob = await res.blob();
              const ext = (blob.type && blob.type.split('/')[1]) || 'jpg';
              recFolder.file(`recyclable-${idx + 1}.${ext}`, blob);
            } catch (e) {
              console.error(`Failed to fetch recyclable image ${idx}:`, e);
            }
          }));
        }
      }

      // Add non-recyclable folder
      if (nonRecyclableImages.length > 0) {
        const nonRecFolder = zip.folder('non-recyclable');
        if (nonRecFolder) {
          await Promise.all(nonRecyclableImages.map(async (src, idx) => {
            try {
              const res = await fetch(src);
              const blob = await res.blob();
              const ext = (blob.type && blob.type.split('/')[1]) || 'jpg';
              nonRecFolder.file(`non-recyclable-${idx + 1}.${ext}`, blob);
            } catch (e) {
              console.error(`Failed to fetch non-recyclable image ${idx}:`, e);
            }
          }));
        }
      }

      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, 'ecosort-captured-images.zip');
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setExporting({ recyclable: false, nonRecyclable: false });
    }
  };

  const isExporting = exporting.recyclable || exporting.nonRecyclable;
  const hasAnyImages = recyclableImages.length > 0 || nonRecyclableImages.length > 0;

  return (
    <div className="space-y-4" id="captured-images">
      {/* Header with Back Button and Export Button */}
      {onBack && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="flex items-center justify-between mb-2"
        >
          <Button
            onClick={onBack}
            variant="outline"
            size="sm"
            className="backdrop-blur-xl bg-[#f3ede1]/80 border-amber-300/40 dark:bg-card/40 dark:border-border text-black dark:text-foreground hover:bg-emerald-600 hover:text-white dark:hover:bg-[#f3ede1]/80 dark:hover:text-emerald-600 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Stats
          </Button>

          <button
            type="button"
            onClick={exportAllImages}
            disabled={!hasAnyImages || isExporting}
            className="text-xs px-3 py-1.5 rounded-md backdrop-blur-xl bg-[#f3ede1]/80 border-amber-300/40 dark:bg-card/40 dark:border-border border text-black dark:text-foreground shadow-sm hover:bg-emerald-600 hover:text-white dark:hover:bg-[#f3ede1]/80 dark:hover:text-emerald-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
            aria-label="Export all images"
          >
            <Download className="w-3.5 h-3.5" />
            {isExporting ? 'Exporting...' : 'Export All'}
          </button>
        </motion.div>
      )}

      <h3 className="text-base font-semibold text-black dark:text-foreground">Captured Images</h3>
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
        <DialogContent className="max-w-3xl p-0 gap-0 overflow-hidden bg-[#f3ede1] dark:bg-card">
          {/* Custom Close Button */}
          <button
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 z-50 rounded-full p-2 bg-black/50 hover:bg-black/70 text-white transition-all duration-200 hover:scale-110 backdrop-blur-sm"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {selected && (
            <div className="w-full">
              <div className="p-3 bg-[#f3ede1] dark:bg-card">
                <img src={selected} alt="Preview" className="w-full h-auto max-h-[70vh] object-contain rounded-lg" />
              </div>

              {/* Delete Button at Bottom */}
              <div className="p-4 border-t border-amber-300/40 dark:border-border bg-[#f3ede1]/80 dark:bg-muted/30 flex justify-center">
                <Button
                  onClick={handleDeleteImage}
                  variant="destructive"
                  size="sm"
                  className="gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Image
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CapturedImages;

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Camera, CameraOff, Aperture, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { predict } from "@/lib/teachableMachine";

interface WebcamSectionProps {
  onPrediction: (prediction: { className: string; probability: number }[]) => void;
  isPredicting: boolean;
  setIsPredicting: (isPredicting: boolean) => void;
}

const WebcamSection = ({ onPrediction, isPredicting, setIsPredicting }: WebcamSectionProps) => {
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modelLoading, setModelLoading] = useState(false);
  const [showCaptureFx, setShowCaptureFx] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (cameraEnabled) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [cameraEnabled]);

  const handleCapture = useCallback(async () => {
    if (!videoRef.current || !cameraEnabled) return;
    try {
      setModelLoading(true);
      setIsPredicting(true);
      setShowCaptureFx(true);
      const predictions = await predict(videoRef.current);
      onPrediction(predictions);
      // brief eco visual
      setTimeout(() => setShowCaptureFx(false), 700);
    } catch (error) {
      console.error("Prediction error:", error);
      toast({
        title: "Capture failed",
        description: "Could not analyze the current frame.",
        variant: "destructive",
      });
    } finally {
      setIsPredicting(false);
      setModelLoading(false);
    }
  }, [cameraEnabled, onPrediction, toast, setIsPredicting]);

  const startCamera = async () => {
    setIsLoading(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        streamRef.current = stream;
      }
      
      toast({
        title: "Camera enabled",
        description: "Point at an item and press Capture",
      });
    } catch (error) {
      console.error("Error accessing camera:", error);
      setCameraEnabled(false);
      toast({
        title: "Camera access denied",
        description: "Please allow camera permissions to use this feature",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="relative backdrop-blur-xl bg-card/40 rounded-3xl p-8 border-2 border-primary/30 glow-eco overflow-hidden min-h-[500px] flex flex-col"
    >
      {/* Camera View */}
      <div className="flex-1 flex items-center justify-center mb-6 relative">
        {cameraEnabled ? (
          <div className="w-full h-full flex items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover rounded-2xl border-2 border-primary/50"
            />
            {/* Capture visual effects */}
            {showCaptureFx && (
              <>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: [0.4, 0], scale: [1, 1.2] }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className="absolute inset-4 rounded-2xl border-4 border-emerald-400/70 pointer-events-none"
                />
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: -10, opacity: [0, 1, 0] }}
                  transition={{ duration: 0.8 }}
                  className="absolute top-4 right-6 text-emerald-400"
                >
                  <Leaf className="w-8 h-8" />
                </motion.div>
              </>
            )}
          </div>
        ) : (
          <div className="text-center">
            <div className="relative">
              <CameraOff className="w-24 h-24 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold mt-6 mb-2 text-foreground">Camera Disabled</h3>
            <p className="text-muted-foreground">
              Enable camera to start waste classification
            </p>
          </div>
        )}
      </div>

      {/* Controls */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={() => setCameraEnabled(!cameraEnabled)}
          className={`w-full py-6 text-lg font-semibold rounded-2xl transition-all duration-300 ${
            cameraEnabled
              ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground'
              : 'bg-primary hover:bg-primary/90 text-primary-foreground glow-eco'
          }`}
        >
          {cameraEnabled ? (
            <>
              <CameraOff className="mr-2 w-5 h-5" />
              Disable Camera
            </>
          ) : (
            <>
              <Camera className="mr-2 w-5 h-5" />
              Enable Camera
            </>
          )}
        </Button>
      </motion.div>

      {/* Capture Button */}
      <motion.div
        className="mt-3"
        whileHover={{ scale: cameraEnabled ? 1.05 : 1 }}
        whileTap={{ scale: cameraEnabled ? 0.95 : 1 }}
      >
        <Button
          onClick={handleCapture}
          disabled={!cameraEnabled || isLoading || modelLoading}
          className={`w-full py-5 text-lg font-semibold rounded-2xl transition-all duration-300 ${
            cameraEnabled ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-muted text-muted-foreground'
          }`}
        >
          <Aperture className="mr-2 w-5 h-5" />
          {modelLoading ? 'Loading model…' : isPredicting ? 'Capturing…' : 'Capture'}
        </Button>
      </motion.div>
      
      {/* Corner indicators */}
      <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-primary/50 rounded-tl-lg" />
      <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-primary/50 rounded-tr-lg" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-primary/50 rounded-bl-lg" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-primary/50 rounded-br-lg" />
    </motion.div>
  );
};

export default WebcamSection;
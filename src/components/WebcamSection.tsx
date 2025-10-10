import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Camera, CameraOff } from "lucide-react";
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const predictionInterval = useRef<number | null>(null);
  const predictingRef = useRef(false);
  const { toast } = useToast();

  useEffect(() => {
    if (cameraEnabled) {
      startCamera();
    } else {
      // Ensure prediction loop and timers are stopped when camera is disabled
      stopPrediction();
      stopCamera();
    }

    return () => {
      // Cleanup on unmount or when dependency changes
      stopPrediction();
      stopCamera();
    };
  }, [cameraEnabled]);

  const startPrediction = useCallback(async () => {
    if (!videoRef.current || !cameraEnabled) return;
    
    try {
      setModelLoading(true);
      // Avoid starting multiple prediction loops
      if (predictionInterval.current !== null) return;
      predictingRef.current = true;
      setIsPredicting(true);
      
      // Start prediction loop
      const predictLoop = async () => {
        if (!videoRef.current) return;
        
        try {
          const predictions = await predict(videoRef.current);
          onPrediction(predictions);
        } catch (error) {
          console.error("Prediction error:", error);
        }
        
        if (predictingRef.current && cameraEnabled) {
          predictionInterval.current = window.setTimeout(predictLoop, 300);
        } else {
          // Ensure interval ref is cleared when stopping
          predictionInterval.current = null;
        }
      };
      
      predictLoop();
    } catch (error) {
      console.error("Error initializing model:", error);
      toast({
        title: "Error",
        description: "Failed to initialize the waste classification model",
        variant: "destructive",
      });
      setIsPredicting(false);
    } finally {
      setModelLoading(false);
    }
  }, [cameraEnabled, onPrediction, toast, setIsPredicting]);

  const stopPrediction = useCallback(() => {
    if (predictionInterval.current !== null) {
      clearTimeout(predictionInterval.current);
      predictionInterval.current = null;
    }
    predictingRef.current = false;
    setIsPredicting(false);
  }, [setIsPredicting]);

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
        
        // Start prediction once video is playing
        startPrediction();
      }
      
      toast({
        title: "Camera enabled",
        description: "Point your camera at waste items to classify them",
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

      {/* Camera Control Button */}
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
      
      {/* Corner indicators */}
      <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-primary/50 rounded-tl-lg" />
      <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-primary/50 rounded-tr-lg" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-primary/50 rounded-bl-lg" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-primary/50 rounded-br-lg" />
    </motion.div>
  );
};

export default WebcamSection;
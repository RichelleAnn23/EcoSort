import React, { useRef, useEffect } from "react";

const WebcamCapture = ({ onPredict }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }

        const interval = setInterval(() => {
          if (videoRef.current && onPredict) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            const imageSrc = canvas.toDataURL("image/jpeg");
            onPredict(imageSrc);
          }
        }, 1000);

        return () => clearInterval(interval);
      } catch (err) {
        console.error("❌ Webcam access error:", err);
      }
    };

    startWebcam();
  }, [onPredict]);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <video
        ref={videoRef}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: "28px",
        }}
        autoPlay
        playsInline
        muted
      />
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default WebcamCapture;

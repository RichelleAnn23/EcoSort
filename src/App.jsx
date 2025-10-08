import React, { useState, useEffect, Suspense } from "react";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import * as mobilenet from "@tensorflow-models/mobilenet";

const WebcamCapture = React.lazy(() => import("./components/WebcamCapture"));

const App = () => {
  const [model, setModel] = useState(null);
  const [prediction, setPrediction] = useState("");
  const [loadingModel, setLoadingModel] = useState(true);

  useEffect(() => {
    const loadModel = async () => {
      setLoadingModel(true);
      try {
        await tf.setBackend("webgl");
        const loadedModel = await mobilenet.load();
        setModel(loadedModel);
        console.log("Mobilenet model loaded successfully.");
      } catch (error) {
        console.error("Error loading the model:", error);
      } finally {
        setLoadingModel(false);
      }
    };
    loadModel();
  }, []);

  const handlePredict = async (imageSrc) => {
    if (!model) {
      console.warn("Model not loaded yet.");
      return;
    }
    setPrediction("Analyzing...");

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;

    img.onload = async () => {
      try {
        const predictions = await model.classify(img);
        if (predictions && predictions.length > 0) {
          const topPrediction = predictions[0];
          setPrediction(
            `${topPrediction.className} (${(topPrediction.probability * 100).toFixed(2)}%)`
          );
        } else {
          setPrediction("No clear prediction.");
        }
      } catch (error) {
        console.error("Error during prediction:", error);
        setPrediction("Error analyzing image.");
      }
    };
    img.onerror = () => {
      console.error("Error loading image for prediction.");
      setPrediction("Error loading image.");
    };
  };

  const styles = {
    container: {
      fontFamily: "'Inter', sans-serif",
      width: "100vw",
      height: "100vh",
      background: "linear-gradient(135deg, #0f4c2e, #1a7a40)", // KEEP ORIGINAL BG
      color: "#F9F7F7",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
      position: "relative",
    },
    blob: (top, left, size, gradient, opacity, anim, zIndex = -1) => ({
      position: "absolute",
      top: top,
      left: left,
      width: size,
      height: size,
      background: gradient,
      borderRadius: "50%",
      opacity: opacity,
      filter: "blur(180px)",
      animation: anim,
      zIndex: zIndex,
    }),
    content: {
      width: "100%",
      maxWidth: "1000px",
      padding: "2rem",
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      gap: "1.5rem",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 10,
      position: "relative",
    },
    heading: {
      fontSize: "5vw",
      fontWeight: "900",
      background: "linear-gradient(90deg, #046241, #133020, #FFB347, #FFC370)",
      backgroundSize: "300% 300%",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      animation: "gradientShift 6s ease-in-out infinite",
      margin: 0,
      letterSpacing: "0.05em",
      lineHeight: 1.1,
    },
    subtitle: {
      fontSize: "1.3vw",
      maxWidth: "800px",
      lineHeight: 1.6,
      fontWeight: "500",
      color: "#e0e0e0",
      marginTop: "0.5rem",
    },
    webcamWrapper: {
      width: "70vw",
      maxWidth: "750px",
      aspectRatio: "16/9",
      borderRadius: "30px",
      overflow: "hidden",
      background: "rgba(255,255,255,0.1)",
      backdropFilter: "blur(30px) saturate(180%)",
      border: "2px solid rgba(255,255,255,0.3)",
      boxShadow: "0 0 60px rgba(0,237,100,0.6), 0 0 90px rgba(168,255,120,0.5)",
      transition: "all 0.5s ease",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      animation: "glowWebcam 3s infinite alternate ease-in-out",
      cursor: "pointer",
      position: "relative",
    },
    webcam: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      borderRadius: "28px",
    },
    resultCard: {
      padding: "30px 50px",
      borderRadius: "35px",
      fontSize: "1.8rem",
      fontWeight: "800",
      letterSpacing: "0.03em",
      color: "#0f4c2e",
      textAlign: "center",
      background: "linear-gradient(135deg, #a8ff78, #f0f9a2, #00ed64)",
      boxShadow: "0 0 60px rgba(168,255,120,0.7), 0 0 100px rgba(0,237,100,0.6)",
      transition: "all 0.4s ease, transform 0.4s ease",
      marginTop: "1.5rem",
      minWidth: "350px",
    },
    resultCardActive: {
      transform: "translateY(-15px) scale(1.08)",
      animation: "pulseResult 2s infinite alternate ease-in-out",
      boxShadow: "0 0 90px rgba(168,255,120,0.9), 0 0 140px rgba(0,237,100,0.8)",
    },
    loadingOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(15, 76, 46, 0.9)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: "28px",
      color: "#a8ff78",
      fontSize: "1.5rem",
      fontWeight: "600",
      zIndex: 15,
      animation: "fadeIn 0.5s ease-out",
    },
    spinner: {
      border: "6px solid rgba(255,255,255,0.3)",
      borderTop: "6px solid #a8ff78",
      borderRadius: "50%",
      width: "50px",
      height: "50px",
      animation: "spin 1s linear infinite",
      marginBottom: "1rem",
    },
    iconRecycle: (size) => ({
      position: "absolute",
      opacity: 0.1,
      fontSize: size,
      color: "#a8ff78",
      animation: "floatAndFade 15s infinite ease-in-out",
      pointerEvents: "none",
    }),
  };

  const generateRandomIconProps = (index) => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    animationDelay: `${index * 2}s, ${index * 3}s`,
    animationDuration: `${10 + Math.random() * 10}s`,
    transform: `translate(-50%, -50%) rotate(${Math.random() * 360}deg)`,
  });

  return (
    <div style={styles.container}>
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap"
        rel="stylesheet"
      />

      <div style={styles.blob("-200px", "-200px", "500px", "radial-gradient(circle, #a8ff78 0%, #00ed64 100%)", 0.18, "blob1Anim 28s infinite alternate ease-in-out, rotate 60s linear infinite")}></div>
      <div style={styles.blob("calc(100% - 400px)", "calc(100% - 400px)", "600px", "radial-gradient(circle, #0f4c2e 0%, #1a7a40 100%)", 0.18, "blob2Anim 35s infinite alternate ease-in-out, rotate 80s linear infinite")}></div>

      {[...Array(8)].map((_, i) => (
        <span
          key={i}
          role="img"
          aria-label="recycle-icon"
          style={{ ...styles.iconRecycle(`${40 + Math.random() * 40}px`), ...generateRandomIconProps(i) }}
        >
          ♻️
        </span>
      ))}

      <div style={styles.content}>
        <h1 style={styles.heading}>♻️ EcoSort AI</h1>
        <p style={styles.subtitle}>
          Smart real-time waste classification. Instantly identify recyclable and non-recyclable items with AI, contributing to a cleaner, greener planet.
        </p>

        <Suspense fallback={<p style={{ color: "#F9F7F7" }}>Initializing Camera...</p>}>
          <div style={styles.webcamWrapper}>
            {loadingModel && (
              <div style={styles.loadingOverlay}>
                <div style={styles.spinner}></div>
                Loading AI Model...
              </div>
            )}
            <WebcamCapture style={styles.webcam} onPredict={handlePredict} />
          </div>
        </Suspense>

        {prediction && (
          <div
            style={
              prediction === "Analyzing..."
                ? { ...styles.resultCard, background: "linear-gradient(135deg, #f0f9a2, #a8ff78)" }
                : { ...styles.resultCard, ...styles.resultCardActive }
            }
          >
            {prediction}
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulseResult {
          0% { transform: translateY(-15px) scale(1.08); }
          50% { transform: translateY(-20px) scale(1.1); }
          100% { transform: translateY(-15px) scale(1.08); }
        }
        @keyframes blob1Anim {
          0%{ transform: translate(0,0) scale(1);}
          50%{ transform: translate(150px,90px) scale(1.1);}
          100%{ transform: translate(0,0) scale(1);}
        }
        @keyframes blob2Anim {
          0%{ transform: translate(0,0) scale(1);}
          50%{ transform: translate(-150px,-90px) scale(1.15);}
          100%{ transform: translate(0,0) scale(1);}
        }
        @keyframes rotate {
          0% { transform: rotate(0deg);}
          100%{ transform: rotate(360deg);}
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes glowWebcam {
          0% { box-shadow: 0 0 60px rgba(0,237,100,0.6), 0 0 90px rgba(168,255,120,0.5);}
          50% { box-shadow: 0 0 80px rgba(0,237,100,0.8), 0 0 120px rgba(168,255,120,0.7);}
          100% { box-shadow: 0 0 60px rgba(0,237,100,0.6), 0 0 90px rgba(168,255,120,0.5);}
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes floatAndFade {
          0% { transform: translate(-50%, -50%) translateY(0px) rotate(0deg) scale(0.8); opacity: 0.1; }
          25% { transform: translate(-50%, -50%) translateY(-20px) rotate(90deg) scale(0.12); opacity: 0.15; }
          50% { transform: translate(-50%, -50%) translateY(0px) rotate(180deg) scale(0.8); opacity: 0.18; }
          75% { transform: translate(-50%, -50%) translateY(20px) rotate(270deg) scale(0.12); opacity: 0.15; }
          100% { transform: translate(-50%, -50%) translateY(0px) rotate(360deg) scale(0.8); opacity: 0.1; }
        }

        @media (max-width: 1024px) {
          h1 { font-size: 6vw; }
          p { font-size: 2vw; }
        }
        @media (max-width: 768px) {
          h1 { font-size: 8vw; }
          p { font-size: 3.5vw; }
        }
        @media (max-width: 480px) {
          h1 { font-size: 10vw; }
          p { font-size: 4.5vw; }
        }
      `}</style>
    </div>
  );
};

export default App;

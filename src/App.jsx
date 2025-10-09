import React, { useState, useEffect, Suspense } from "react";
import * as tmImage from "@teachablemachine/image";
import WebcamCapture from "./components/WebcamCapture";

const MODEL_URL = "https://teachablemachine.withgoogle.com/models/YOUR_MODEL_URL/";

const App = () => {
  const [model, setModel] = useState(null);
  const [prediction, setPrediction] = useState("");
  const [loading, setLoading] = useState(true);
  const [animatePrediction, setAnimatePrediction] = useState(false);

  useEffect(() => {
    const loadModel = async () => {
      try {
        const loadedModel = await tmImage.load(
          MODEL_URL + "model.json",
          MODEL_URL + "metadata.json"
        );
        setModel(loadedModel);
      } catch (error) {
        console.error("❌ Error loading model:", error);
      } finally {
        setLoading(false);
      }
    };
    loadModel();
  }, []);

  const handlePredict = async (imageSrc) => {
    if (model) {
      const image = new Image();
      image.src = imageSrc;
      image.onload = async () => {
        const predictionResults = await model.predict(image);
        const highest = predictionResults.reduce((prev, current) =>
          prev.probability > current.probability ? prev : current
        );
        setPrediction(highest.className);

        // Trigger pop animation
        setAnimatePrediction(true);
        setTimeout(() => setAnimatePrediction(false), 300);
      };
    }
  };

  const getPredictionColor = (label) => {
    if (!label) return "#F0F0E0"; // soft off-white
    if (label.toLowerCase().includes("recycl")) return "#04B45F"; // green
    if (label.toLowerCase().includes("non")) return "#FFC370"; // yellow-orange
    return "#F0F0E0"; // fallback soft off-white
  };

  const recycleIcons = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    size: Math.random() * 20 + 15,
    top: Math.random() * 100,
    left: Math.random() * 100,
    duration: Math.random() * 25 + 15,
    delay: Math.random() * 20,
    rotate: Math.random() * 360,
    directionX: Math.random() * 200 - 100,
    directionY: Math.random() * 200 - 100,
  }));

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Inter', sans-serif",
        color: "#F5EEDB",
        overflow: "hidden",
        position: "relative",
        padding: "20px",
        boxSizing: "border-box",
        background: "#0b3e2b", // dark green background
      }}
    >
      {/* Background blobs */}
      <div className="background-blob blob1"></div>
      <div className="background-blob blob2"></div>
      <div className="background-blob blob3"></div>

      {/* Moving recycle icons */}
      {recycleIcons.map((icon) => (
        <div
          key={icon.id}
          className="recycle-icon"
          style={{
            fontSize: `${icon.size}px`,
            top: `${icon.top}%`,
            left: `${icon.left}%`,
            animationDuration: `${icon.duration}s`,
            animationDelay: `${icon.delay}s`,
            transform: `rotate(${icon.rotate}deg)`,
            "--dirX": `${icon.directionX}px`,
            "--dirY": `${icon.directionY}px`,
          }}
        >
          ♻️
        </div>
      ))}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          width: "100%",
          maxWidth: "1000px",
          gap: "30px",
          zIndex: 2,
        }}
      >
        {/* Title */}
        <h1
          style={{
            fontSize: "4vw",
            fontWeight: "900",
            textAlign: "center",
            marginBottom: "0",
            background: "linear-gradient(90deg, #04B45F, #FFC370, #A2FF7D)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 0 20px rgba(255,195,112,0.5), 0 0 15px rgba(4,180,95,0.5)",
            animation: "pulseTitle 2.5s ease-in-out infinite alternate",
          }}
        >
          ♻️ EcoSort AI
        </h1>

        <p
          style={{
            fontSize: "1.2rem",
            color: "#CFCFCF",
            maxWidth: "700px",
            textAlign: "center",
            marginTop: "0",
            textShadow: "0 0 10px rgba(0,0,0,0.3)",
          }}
        >
          Real-time AI waste classifier. Show your items to the camera and instantly
          see if they are recyclable or non-recyclable.
        </p>

        {loading ? (
          <div style={{ color: "#fff", fontSize: "1.8rem", fontWeight: "600" }}>
            Loading AI Model...
          </div>
        ) : (
          <Suspense fallback={<div>Loading Webcam...</div>}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "20px",
                width: "100%",
              }}
            >
              {/* Webcam card */}
              <div
                style={{
                  width: "450px",
                  height: "340px",
                  borderRadius: "25px",
                  overflow: "hidden",
                  position: "relative",
                  background: "rgba(0,0,0,0.2)",
                  backdropFilter: "blur(25px)",
                  border: "2px solid rgba(4,180,95,0.5)",
                  boxShadow: "0 0 25px rgba(4,180,95,0.6), 0 0 50px rgba(4,180,95,0.3)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
                className="webcam-card"
              >
                <WebcamCapture onPredict={handlePredict} />
                <div className="scanner-line"></div>
              </div>

              {/* Prediction Card with pop animation */}
              <div
                className={`prediction-card ${animatePrediction ? "pop" : ""}`}
                style={{
                  padding: "16px 36px",
                  borderRadius: "30px",
                  fontSize: "1.4rem",
                  color: "#000",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  textAlign: "center",
                  minWidth: "280px",
                  background: getPredictionColor(prediction),
                  boxShadow: "0 0 10px rgba(0,0,0,0.2)",
                  transition: "all 0.3s ease",
                }}
              >
                {prediction ? prediction : "Show an item to the camera"}
              </div>
            </div>
          </Suspense>
        )}
      </div>

      <style>{`
        @keyframes pulseTitle {
          0% { text-shadow: 0 0 15px rgba(255,195,112,0.4), 0 0 10px rgba(4,180,95,0.4); }
          100% { text-shadow: 0 0 25px rgba(255,195,112,0.6), 0 0 20px rgba(4,180,95,0.6); }
        }

        .scanner-line {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: rgba(4,180,95,0.6);
          animation: scan 2s infinite;
        }
        @keyframes scan {
          0% { top: 0; }
          50% { top: 100%; }
          100% { top: 0; }
        }

        .background-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(150px);
          opacity: 0.15;
          animation: moveBlob 40s infinite alternate ease-in-out;
          z-index: 1;
        }
        .blob1 { width: 500px; height: 500px; background: #046241; top: -150px; left: -150px; }
        .blob2 { width: 400px; height: 400px; background: #0b3e2b; top: 50%; left: 70%; }
        .blob3 { width: 600px; height: 600px; background: #133020; top: 30%; left: 40%; }

        @keyframes moveBlob {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(120px, -80px) scale(1.1); }
          100% { transform: translate(-60px, 100px) scale(0.95); }
        }

        .recycle-icon {
          position: absolute;
          color: rgba(255,255,255,0.2);
          animation-name: floatSwirl;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        @keyframes floatSwirl {
          0% { transform: translate(0,0) rotate(0deg); opacity: 0.2; }
          50% { transform: translate(var(--dirX), var(--dirY)) rotate(180deg); opacity: 0.35; }
          100% { transform: translate(0,0) rotate(360deg); opacity: 0.2; }
        }

        /* Pop animation for prediction card */
        .prediction-card.pop {
          animation: popCard 0.3s ease forwards;
        }
        @keyframes popCard {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }

        @media (max-width: 768px) {
          h1 { font-size: 6vw; }
          p { font-size: 3vw; }
          div[style*="width: 450px"] { width: 90vw !important; height: 50vw !important; }
        }
      `}</style>
    </div>
  );
};

export default App;

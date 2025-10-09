import React, { useState, useEffect, Suspense } from "react";
import * as tmImage from "@teachablemachine/image";
import WebcamCapture from "./components/WebcamCapture";

const MODEL_URL = "https://teachablemachine.withgoogle.com/models/YOUR_MODEL_URL/";

const App = () => {
  const [model, setModel] = useState(null);
  const [prediction, setPrediction] = useState("");
  const [loading, setLoading] = useState(true);
  const [animatePrediction, setAnimatePrediction] = useState(false);

  const [stats, setStats] = useState({ recyclable: 0, nonRecyclable: 0 });
  const [lastDetected, setLastDetected] = useState(null);
  const [probability, setProbability] = useState(0);

  const [cameraEnabled, setCameraEnabled] = useState(true);

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
    if (model && cameraEnabled) {
      const image = new Image();
      image.src = imageSrc;
      image.onload = async () => {
        const predictionResults = await model.predict(image);
        const highest = predictionResults.reduce((prev, current) =>
          prev.probability > current.probability ? prev : current
        );

        // Determine recycle vs non-recycle
        const label = highest.className.toLowerCase().includes("recycl") ? "Recycle" : "Non-Recycle";
        setPrediction(label);
        setProbability(highest.probability);

        // Update statistics dynamically
        setStats((prev) => ({
          recyclable: prev.recyclable + (label === "Recycle" ? 1 : 0),
          nonRecyclable: prev.nonRecyclable + (label === "Non-Recycle" ? 1 : 0),
        }));

        setLastDetected(new Date().toLocaleTimeString());
        setAnimatePrediction(true);
        setTimeout(() => setAnimatePrediction(false), 300);
      };
    }
  };

  const getPredictionColor = (label) => {
    if (!label) return "#F0F0E0";
    if (label === "Recycle") return "#04B45F";
    if (label === "Non-Recycle") return "#FFC370";
    return "#F0F0E0";
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
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        fontFamily: "'Inter', sans-serif",
        color: "#F5EEDB",
        overflowY: "auto",
        position: "relative",
        padding: "20px",
        boxSizing: "border-box",
        background: "#0b3e2b",
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
        className="app-content"
        style={{
          zIndex: 2,
          width: "100%",
          maxWidth: "1000px",
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          alignItems: "center",
        }}
      >
        {/* Top Banner */}
        <div
          style={{
            width: "100%",
            padding: "20px 30px",
            borderRadius: "20px",
            background: "rgba(4,180,95,0.3)",
            boxShadow: "0 0 15px rgba(4,180,95,0.3)",
            textAlign: "center",
            color: "#fff",
            fontWeight: "600",
            fontSize: "1.3rem",
          }}
        >
          Welcome to ♻️ EcoSort AI – Real-time Waste Classification
        </div>

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
            textShadow:
              "0 0 20px rgba(255,195,112,0.5), 0 0 15px rgba(4,180,95,0.5)",
            animation: "pulseTitle 2.5s ease-in-out infinite alternate",
          }}
        >
          ♻️ EcoSort AI
        </h1>

        {loading ? (
          <div style={{ color: "#fff", fontSize: "1.8rem", fontWeight: "600" }}>
            Loading AI Model...
          </div>
        ) : (
          <Suspense fallback={<div>Loading Webcam...</div>}>
            {/* Main Section */}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "center",
                gap: "40px",
                width: "100%",
                flexWrap: "wrap",
              }}
            >
              {/* Webcam */}
              <div
                className="webcam-card"
                style={{
                  width: "450px",
                  height: "340px",
                  borderRadius: "25px",
                  overflow: "hidden",
                  position: "relative",
                  background: "rgba(0,0,0,0.2)",
                  backdropFilter: "blur(25px)",
                  border: "2px solid rgba(4,180,95,0.5)",
                  boxShadow:
                    "0 0 25px rgba(4,180,95,0.6), 0 0 50px rgba(4,180,95,0.3)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
              >
                {cameraEnabled && <WebcamCapture onPredict={handlePredict} />}
                <button
                  onClick={() => setCameraEnabled(!cameraEnabled)}
                  style={{
                    position: "absolute",
                    bottom: "10px",
                    left: "10px",
                    padding: "5px 10px",
                    borderRadius: "15px",
                    border: "1px solid #fff",
                    background: "transparent",
                    color: "#fff",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "0.9rem",
                  }}
                >
                  {cameraEnabled ? "Disable" : "Enable Camera"}
                </button>
              </div>

              {/* Prediction Container */}
              <div
                className={`prediction-card ${animatePrediction ? "pop" : ""}`}
                style={{
                  padding: "25px 35px",
                  borderRadius: "25px",
                  fontSize: "1.2rem",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  minWidth: "300px",
                  maxWidth: "350px",
                  background: "rgba(255,255,255,0.1)",
                  backdropFilter: "blur(15px)",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "15px",
                  transition: "all 0.3s ease",
                  color: "#F5F5F5",
                }}
              >
                <div
                  style={{
                    fontSize: "1.4rem",
                    fontWeight: "700",
                    color: getPredictionColor(prediction),
                    textAlign: "center",
                  }}
                >
                  {prediction ? prediction : "Show an item to the camera"}
                </div>

                {prediction && (
                  <>
                    <div style={{ fontSize: "1rem", color: "#CFCFCF" }}>
                      Probability: {(probability * 100).toFixed(2)}%
                    </div>

                    <div
                      style={{
                        width: "100%",
                        height: "12px",
                        borderRadius: "10px",
                        background: "rgba(255,255,255,0.2)",
                        overflow: "hidden",
                        marginTop: "5px",
                      }}
                    >
                      <div
                        style={{
                          width: `${(probability * 100).toFixed(2)}%`,
                          height: "100%",
                          background: getPredictionColor(prediction),
                          borderRadius: "10px",
                          transition: "width 0.5s ease",
                        }}
                      ></div>
                    </div>

                    <div style={{ fontSize: "0.9rem", color: "#AFAFAF", marginTop: "5px" }}>
                      Last detected: {lastDetected}
                    </div>

                    <div
                      style={{
                        marginTop: "10px",
                        padding: "10px 15px",
                        borderRadius: "15px",
                        background:
                          prediction === "Recycle"
                            ? "rgba(4,180,95,0.3)"
                            : "rgba(255,195,112,0.3)",
                        color: prediction === "Recycle" ? "#04B45F" : "#FFC370",
                        fontSize: "0.95rem",
                        textAlign: "center",
                      }}
                    >
                      {prediction === "Recycle"
                        ? "✅ This item is recyclable. Please place it in the recycling bin."
                        : "❌ This item is non-recyclable. Dispose of it properly to avoid contamination."}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Scrolling Section (Banners, Stats, Info) */}
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "25px",
                marginTop: "50px",
              }}
            >
              {/* Banner */}
              <div
                style={{
                  width: "90%",
                  maxWidth: "900px",
                  padding: "25px",
                  borderRadius: "20px",
                  background: "rgba(4,180,95,0.2)",
                  boxShadow: "0 0 15px rgba(4,180,95,0.3)",
                  color: "#fff",
                  textAlign: "center",
                  fontSize: "1.2rem",
                  fontWeight: "600",
                }}
              >
                🌿 Tip: Always sort your recyclable items properly to reduce waste!
              </div>

              {/* Statistics */}
              <div
                style={{
                  width: "90%",
                  maxWidth: "900px",
                  padding: "25px",
                  borderRadius: "20px",
                  background: "rgba(4,180,95,0.2)",
                  boxShadow: "0 0 15px rgba(4,180,95,0.3)",
                  color: "#fff",
                  display: "flex",
                  justifyContent: "space-around",
                  flexWrap: "wrap",
                  gap: "20px",
                }}
              >
                <div
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    padding: "20px",
                    borderRadius: "20px",
                    textAlign: "center",
                    flex: 1,
                    minWidth: "120px",
                  }}
                >
                  ♻️ Recyclables
                  <div style={{ fontSize: "2rem", marginTop: "10px", color: "#04B45F" }}>
                    {stats.recyclable}
                  </div>
                </div>
                <div
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    padding: "20px",
                    borderRadius: "20px",
                    textAlign: "center",
                    flex: 1,
                    minWidth: "120px",
                  }}
                >
                  ❌ Non-recyclables
                  <div style={{ fontSize: "2rem", marginTop: "10px", color: "#FFC370" }}>
                    {stats.nonRecyclable}
                  </div>
                </div>
              </div>

              {/* Info Cards */}
              <div
                style={{
                  width: "90%",
                  maxWidth: "900px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                <div
                  style={{
                    padding: "20px",
                    borderRadius: "20px",
                    background: "rgba(4,180,95,0.2)",
                    boxShadow: "0 0 15px rgba(4,180,95,0.3)",
                    color: "#fff",
                  }}
                >
                  ♻️ Info: Recyclable items help reduce landfill waste and conserve natural resources.
                </div>
                <div
                  style={{
                    padding: "20px",
                    borderRadius: "20px",
                    background: "rgba(4,180,95,0.2)",
                    boxShadow: "0 0 15px rgba(4,180,95,0.3)",
                    color: "#fff",
                  }}
                >
                  ⚠️ Info: Non-recyclable items must be disposed of properly to avoid contamination.
                </div>
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

        .background-blob {
          position: fixed;
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
          position: fixed;
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
          div.webcam-card { width: 90vw !important; height: 50vw !important; }
        }
      `}</style>
    </div>
  );
};

export default App;

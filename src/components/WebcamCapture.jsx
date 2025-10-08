import React, { useRef } from "react";
import Webcam from "react-webcam";

const WebcamCapture = ({ onPredict }) => {
  const webcamRef = useRef(null);

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    onPredict(imageSrc);
  };

  const styles = {
    container: { marginTop: "20px" },
    button: {
      marginTop: "10px",
      padding: "10px 20px",
      backgroundColor: "#43a047",
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.container}>
      <Webcam ref={webcamRef} screenshotFormat="image/jpeg" />
      <br />
    </div>
  );
};

export default WebcamCapture;

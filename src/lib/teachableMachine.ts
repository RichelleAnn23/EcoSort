import * as tmImage from '@teachablemachine/image';

const URL = "https://teachablemachine.withgoogle.com/models/hoCauuHNP/";
let model: tmImage.CustomMobileNet | null = null;
let maxPredictions: number = 0;

export const initModel = async () => {
  if (!model) {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";
    
    // Load the model and metadata
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
  }
  return model;
};

export const predict = async (image: HTMLVideoElement) => {
  if (!model) {
    await initModel();
  }
  
  if (model) {
    const prediction = await model.predict(image);
    // Sort predictions by probability in descending order
    prediction.sort((a, b) => b.probability - a.probability);
    return prediction;
  }
  
  return [];
};

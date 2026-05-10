// src/utils/ocrService.js
import { createWorker } from 'tesseract.js';

export const extractTextFromImage = async (imageFile, onProgress) => {
  const worker = await createWorker('eng');
  
  if (onProgress) {
    worker.logger = (m) => {
      if (m.status === 'recognizing text') {
        onProgress(Math.floor(m.progress * 100));
      }
    };
  }

  try {
    const { data: { text } } = await worker.recognize(imageFile);
    await worker.terminate();
    return text;
  } catch (error) {
    await worker.terminate();
    throw new Error("OCR failed: " + error.message);
  }
};
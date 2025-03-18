import React, { JSX, useState } from "react";
import Tesseract from "tesseract.js";
import "./App.css";

const characterMap: Record<string, string> = {
  "?": "අ",
  "_": "ක",
  "o": "ට",
  "0": "ෆ",
  "a": "ප",
  "T": "ල",
  "8": "ප",
  "ඉං": "ඉමo",
  "॥": "ට",
};

const autoCorrectText = (text: string): JSX.Element[] => {
  return text.split("").map((char, index) => {
    if (characterMap[char]) {
      return (
        <span style={{ color: "red", fontWeight: "bold" }} key={index}>
          {characterMap[char]}
        </span>
      );
    } else {
      return <span key={index}>{char}</span>;
    }
  });
};

const App: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [text, setText] = useState<string>("Processing result will appear here...");
  const [highlightedText, setHighlightedText] = useState<JSX.Element[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      processOCR(file);
    }
  };

  const processOCR = async (file: File) => {
    setLoading(true);
    setText("Processing...");
    try {
      const { data } = await Tesseract.recognize(file, "sin+eng", {
        logger: (m) => console.log(m),
      });
      setText(data.text);
      setHighlightedText(autoCorrectText(data.text));
    } catch (error) {
      setText("Error processing the image.");
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h1 className="title">Palm-leaf Manuscript OCR</h1>

      <input type="file" accept="image/*" onChange={handleImageUpload} className="file-input" />

      {image && <img src={image} alt="Uploaded" className="uploaded-image" />}

      {loading && <p className="loading-text">Processing...</p>}

      <div className="result-container">
        <h2 className="result-title">Extracted Text:</h2>
        <p className="result-text">{highlightedText}</p>
      </div>
    </div>
  );
};

export default App;

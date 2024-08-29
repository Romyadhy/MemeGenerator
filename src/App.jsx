import React, { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [memes, setMemes] = useState([]);
  const [currentMeme, setCurrentMeme] = useState(null);
  const [text, setText] = useState("");
  const [textPosition, setTextPosition] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);

  const canvasRef = useRef(null);

  // Fetch memes from imgflip API
  useEffect(() => {
    fetch("https://api.imgflip.com/get_memes")
      .then((response) => response.json())
      .then((data) => {
        setMemes(data.data.memes);
        setCurrentMeme(data.data.memes[0]); // Set the first meme as the initial one
      })
      .catch((error) => console.error("Error fetching memes:", error));
  }, []);

  // Function to choose another meme
  const handleNextMeme = () => {
    const randomIndex = Math.floor(Math.random() * memes.length);
    setCurrentMeme(memes[randomIndex]);
  };

  // Draw meme and text on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (currentMeme) {
      const image = new Image();
      image.src = currentMeme.url;
      image.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        ctx.font = "30px Arial";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.fillText(text, textPosition.x, textPosition.y);
      };
    }
  }, [currentMeme, text, textPosition]);

  // Handle drag and drop for text
  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      setTextPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center h-40">
        <h1 className="font-bold text-4xl">Welcome to Meme Generator</h1>
        <p className="text-xl">Please Choose the Image and insert the text</p>
      </div>

      <div className=" flex justify-center items-center">
        <p>Input Text</p>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your meme text"
          className="border p-2 rounded-md"
        />
      </div>

      <div className="my-4 flex flex-col justify-center items-center">
        <p>Choose Image</p>
        <canvas
          ref={canvasRef}
          width={500}
          height={500}
          className="border rounded-md"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        />
        <button
          onClick={handleNextMeme}
          className="mt-4 bg-blue-500 text-white p-2 rounded-md"
        >
          Choose Another Image
        </button>
      </div>

      <div className="my-4 flex justify-center items-center">
        <button className="bg-green-500 text-white p-2 rounded-md">
          Generate Meme
        </button>
      </div>
    </>
  );
}

export default App;

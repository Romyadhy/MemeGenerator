import React, { useState, useEffect, useRef } from "react";
import "./App.css";

// Komponen TrashIcon untuk area sampah
const TrashIcon = ({ isActive }) => (
  <div
    className={`trash-icon ${isActive ? "active" : ""}`}
    style={{
      width: "60px",
      height: "60px",
      backgroundColor: isActive ? "red" : "gray",
      borderRadius: "50%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      cursor: "pointer",
      transition: "background-color 0.3s",
    }}
  >
    🗑️
  </div>
);

function App() {
  const [memes, setMemes] = useState([]);
  const [currentMeme, setCurrentMeme] = useState(null);
  const [textInput, setTextInput] = useState("");
  const [texts, setTexts] = useState([]);
  const [draggingTextId, setDraggingTextId] = useState(null);
  const [isOverTrash, setIsOverTrash] = useState(false);

  const canvasRef = useRef(null);
  const trashRef = useRef(null);

  // Fetch memes from imgflip API
  useEffect(() => {
    fetch("https://api.imgflip.com/get_memes")
      .then((response) => response.json())
      .then((data) => {
        setMemes(data.data.memes);
        setCurrentMeme(data.data.memes[0]); // Set the first meme as the initial one
        console.log("Initial meme:", data.data.memes[0]);
      })
      .catch((error) => console.error("Error fetching memes:", error));
  }, []);

  // Function to choose another meme
  const handleNextMeme = () => {
    if (memes.length === 0) return;
    const randomIndex = Math.floor(Math.random() * memes.length);
    const selectedMeme = memes[randomIndex];
    setCurrentMeme(selectedMeme);
    console.log("Selected meme:", selectedMeme);
    setTexts([]); // Reset texts when meme changes
  };

  // Draw meme and texts on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (currentMeme) {
      const image = new Image();
      image.crossOrigin = "anonymous"; // CORS handling
      image.src = currentMeme.url;
      image.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        // Draw each text
        texts.forEach((item) => {
          ctx.font = "30px Arial";
          ctx.fillStyle = "black";
          ctx.textAlign = "center";
          ctx.fillText(item.text, item.x, item.y);
        });
      };
      image.onerror = () => {
        console.error("Error loading image.");
      };
    }
  }, [currentMeme, texts]);

  // Handle adding text on Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && textInput.trim() !== "") {
      const newText = {
        id: Date.now(), // Unique ID
        text: textInput,
        x: 250, // Default position (center)
        y: 250,
      };
      setTexts([...texts, newText]);
      setTextInput("");
      console.log("Added text:", newText);
    }
  };

  // Handle mouse events for dragging texts
  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Check if mouse is on any text
    for (let i = texts.length - 1; i >= 0; i--) {
      const item = texts[i];
      // Simple bounding box check
      const ctx = canvas.getContext("2d");
      ctx.font = "30px Arial";
      const textWidth = ctx.measureText(item.text).width;
      const textHeight = 30; // Approximate height
      if (
        mouseX >= item.x - textWidth / 2 &&
        mouseX <= item.x + textWidth / 2 &&
        mouseY >= item.y - textHeight &&
        mouseY <= item.y
      ) {
        setDraggingTextId(item.id);
        break;
      }
    }
  };

  const handleMouseUp = (e) => {
    if (draggingTextId !== null) {
      // Check if over trash
      const trash = trashRef.current;
      const trashRect = trash.getBoundingClientRect();
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      if (
        mouseX >= trashRect.left &&
        mouseX <= trashRect.right &&
        mouseY >= trashRect.top &&
        mouseY <= trashRect.bottom
      ) {
        // Delete the text
        setTexts(texts.filter((item) => item.id !== draggingTextId));
        console.log("Deleted text with ID:", draggingTextId);
      }
      setDraggingTextId(null);
      setIsOverTrash(false);
    }
  };

  const handleMouseMove = (e) => {
    if (draggingTextId !== null) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const newX = e.clientX - rect.left;
      const newY = e.clientY - rect.top;

      // Update position of the dragging text
      setTexts((prevTexts) =>
        prevTexts.map((item) =>
          item.id === draggingTextId ? { ...item, x: newX, y: newY } : item
        )
      );

      // Check if over trash
      const trash = trashRef.current;
      const trashRect = trash.getBoundingClientRect();
      if (
        e.clientX >= trashRect.left &&
        e.clientX <= trashRect.right &&
        e.clientY >= trashRect.top &&
        e.clientY <= trashRect.bottom
      ) {
        setIsOverTrash(true);
      } else {
        setIsOverTrash(false);
      }
    }
  };

  // Handle download meme
  const handleDownloadMeme = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL("image/png");
    console.log("Download URL:", dataURL);
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "meme.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      {/* Header */}
      <div className="flex flex-col justify-center items-center h-40">
        <h1 className="font-bold text-4xl">Welcome to Meme Generator</h1>
        <p className="text-xl">Please Choose the Image and insert the text</p>
      </div>

      {/* Input Text */}
      <div className="flex justify-center items-center mb-4">
        <p className="mr-2">Input Text:</p>
        <input
          type="text"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter your meme text and press Enter"
          className="border p-2 rounded-md w-64"
        />
      </div>

      {/* Canvas and Choose Image */}
      <div className="my-4 flex flex-col justify-center items-center">
        <p className="mb-2">Choose Image</p>
        <p className="font-light italic">Desc</p>
        <canvas
          ref={canvasRef}
          width={500}
          height={500}
          className="border rounded-md"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        />
        {/* Trash Icon Below the Canvas */}
      <div className="flex justify-center items-center my-4" ref={trashRef}>
        <TrashIcon isActive={isOverTrash} />
      </div>
        <button
          onClick={handleNextMeme}
          className="mt-4 bg-blue-500 text-white p-2 rounded-md"
        >
          Choose Another Image
        </button>
      </div>

      

      {/* Download Button */}
      <div className="my-4 flex justify-center items-center">
        <button
          onClick={handleDownloadMeme}
          className="bg-green-500 text-white p-2 rounded-md"
        >
          Generate Meme & Download Meme
        </button>
      </div>
    </>
  );
}

export default App;

# MemeMaker ReactJS

A professional and interactive meme generator application built with React and Vite. This project allows users to create custom memes by selecting templates, adding text, and manipulating elements directly on the canvas.

## Features

- **Dynamic Meme Fetching**: Automatically fetches popular meme templates from the Imgflip API.
- **Custom Text Addition**: Add multiple text elements to your meme.
- **Interactive Canvas**:
  - **Drag & Drop**: Easily position text anywhere on the meme.
  - **Delete Functionality**: Drag text to the trash icon to remove it.
- **Download**: Generate and download your custom meme as a PNG file.
- **Responsive Design**: Built with Tailwind CSS for a modern and responsive user interface.

## Tech Stack

- **Frontend Framework**: [React](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)

## Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed on your system.

### Installation

1. **Clone the repository** (if applicable) or navigate to the project directory.

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open the app**:
   Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`).

## Usage

1. **Select a Meme**: The app loads with a default meme. Click "Choose Another Image" to cycle through available templates.
2. **Add Text**: Type your desired text in the input box and press **Enter**.
3. **Position Text**: Click and drag the text on the image to position it perfectly.
4. **Delete Text**: Drag any unwanted text to the **Trash Icon** that appears below the canvas.
5. **Download**: Click "Generate Meme & Download Meme" to save your creation.

## Project Structure

- `src/App.jsx`: Main application logic, including state management and canvas rendering.
- `src/components`: (If applicable) Reusable UI components.
- `src/assets`: Static assets.

> [!NOTE]
> This project is still in development and needs more improvement in creating more powerful and customizable features.

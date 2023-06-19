import { useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("Hi 👋");

  function onClick() {
    fetch(import.meta.env.VITE_APP_API_URL)
      .then((response) => response.text())
      .then(setMessage);
  }

  return (
    <div className="App">
      <div className="card">
        <input type="file" />
        <button onClick={onClick}>Upload</button>
      </div>
    </div>
  );
}

export default App;

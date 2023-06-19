import "./App.css";

function App() {
  function onClick() {
    console.log("clicked");
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

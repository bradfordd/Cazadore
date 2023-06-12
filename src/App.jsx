import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import axios from "axios";

// Import the Login component
import Login from "./Login";

axios.defaults.baseURL = "http://localhost:5000";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Login />
    </>
  );
}

export default App;

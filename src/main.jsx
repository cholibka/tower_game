import React from "react";
import ReactDOM from "react-dom/client";
import Game from "./components/Game.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    // <React.StrictMode>
    //   <App />
    // </React.StrictMode>,
    <React.StrictMode>
        <Game />
    </React.StrictMode>
);

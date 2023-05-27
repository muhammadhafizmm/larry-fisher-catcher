import React from "react";
import Background from "./common/Background";
import KomoditasList from "./pages/KomoditasList";

import "./App.scss";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="app">
      <div className="main">
        <KomoditasList/>
      </div>
      <Background />
    </div>
  );
}

export default App;

import React from "react";
import Background from "./common/Background";
import KomoditasList from "./pages/KomoditasList";

import { Routes, Route } from "react-router-dom";

import "./App.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import SearchPage from "./pages/SearchPage";
import FilterPage from "./pages/FilterPage";
import AddKomoditas from "./pages/AddKomoditas";

function App() {
  return (
    <div className="app">
      <div className="main">
        <Routes>
          <Route path="/" element={<KomoditasList />}>
            <Route path="search" element={<SearchPage />} />
            <Route path="filter" element={<FilterPage />} />
          </Route>
          <Route path="/komoditas/add" element={<AddKomoditas />} />
        </Routes>
      </div>
      <Background />
    </div>
  );
}

export default App;

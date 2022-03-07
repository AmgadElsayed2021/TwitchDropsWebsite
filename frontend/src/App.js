import "./App.css";
import React from "react";
import { Routes, Route } from "react-router-dom";
import { Home, Previous, Faqs, Future, Connect } from "./pages";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/prev" element={<Previous />} />
        <Route path="/future" element={<Future />} />
        <Route path="/connect" element={<Connect />} />
        <Route path="/faqs" element={<Faqs />} />
      </Routes>
    </div>
  );
}

export default App;

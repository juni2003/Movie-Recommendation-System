import React from "react";
import MovieRecommender from "./components/MovieRecommender";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import About from "./components/About";
const App = () => {
  return (
    <Routes>
      <Route path="MovieRecommender" element={<MovieRecommender/>} />
      <Route path="/" element={<Home/>} />
      <Route path="/About" element={<About />} />

    </Routes>
    
  );
};

export default App;

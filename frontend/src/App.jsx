import "./App.css";
import Navbar from "./components/navbar";
import BinPlacement from "./pages/BinMapPlacement";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HowItWorks from "./pages/HowItWorks";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<BinPlacement />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

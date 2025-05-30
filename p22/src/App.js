import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./Home";
import "./Home.css";
import "./Login.css";
import "./Register.css";
import "./Solutions.css";
import "./About.css";
import "./Goal.css";
import "./Loginhome.css";
import "./Imageup.css";
import "./Userdet.css";
import "./Textc.css";
import "./Dietc.css";
import "./Legal.css";
import Home from "./Home";
import Solutions from "./Solutions";
import Login from "./Login";
import About from "./About";
import Register from "./Register";
import Goal from "./Goal";
import Loginhome from "./Loginhome";
import Imageup from "./Imageup";
import Userdet from "./Userdet";
import Textc from "./Textc";
import Dietc from "./Dietc";
import ScrollToTop from "./ScrollToTop"; 
import Terms from "./Terms"; 
import Privacy from "./Privacy"; 
function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="App">
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/About" element={<About />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Goal" element={<Goal />} />
          <Route path="/Loginhome" element={<Loginhome />} />
          <Route path="/Imageup" element={<Imageup />} />
          <Route path="/Userdet" element={<Userdet />} />
          <Route path="/Textc" element={<Textc />} />
          <Route path="/Dietc" element={<Dietc />} />
          <Route path="/Terms" element={<Terms />} />
          <Route path="/Privacy" element={<Privacy/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage/LandingPage";
import App from "./App";

function App1() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />}/>
        <Route path="/home" element={<App/>}/>
      </Routes>
    </Router>
  );
}

export default App1;
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage/LandingPage";
import App from "./App";
import Login from "./components/Authentication/Login";
import Signup from "./components/Authentication/Signup";
import ProtectedRoutes from "./components/Authentication/ProtectedRoutes";

function App1() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />}/>
        <Route path="/home" element={<ProtectedRoutes><App/></ProtectedRoutes>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
      </Routes>
    </Router>
  );
}

export default App1;
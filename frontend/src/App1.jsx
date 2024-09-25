import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage/LandingPage";
import App from "./App";
import Login from "./components/Authentication/Login";
import Signup from "./components/Authentication/Signup";
import ProtectedRoutes from "./components/Authentication/ProtectedRoutes";
import OnBoard from "./components/Pages/OnBoard";
// import KanbanHome from "./components/Pages/Kanban/KanbanHome";

function App1() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path="/home" element={<ProtectedRoutes><App/></ProtectedRoutes>}/>
        <Route path="/onboard" element={<ProtectedRoutes><OnBoard/></ProtectedRoutes>}/>
        {/* <Route path="/kanbanHome" element={<ProtectedRoutes><KanbanHome/></ProtectedRoutes>}/> */}
      </Routes>
    </Router>
  );
}

export default App1;
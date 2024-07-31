import { useState } from "react";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import Page from "./components/Pages/Page";
import { PageContextProvider } from "./components/Contexts/PageContext";
import { TbMinusVertical } from "react-icons/tb";
import './App.css';
import App1 from "./App1";

function App() {
  const [count, setCount] = useState(0);
  const [showSideBar, setShowSideBar] = useState(true);

  const toggleSidebar = () =>{
    setShowSideBar(prev => !prev);
  }

  return (
      <PageContextProvider>
        <Header />
        <div style={{ display: "flex", height: "100vh" }}>
          {showSideBar && <Sidebar setShowSideBar={{ showSideBar, setShowSideBar }} />}
          <div className="sidebar-opener">
            <TbMinusVertical onClick={toggleSidebar} />
          </div>
            <Page />
        </div>
      </PageContextProvider>
  );
}

export default App;

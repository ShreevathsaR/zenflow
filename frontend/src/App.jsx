import { useState } from "react";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import Page from "./components/Pages/Page";
import { PageContextProvider } from "./components/Contexts/PageContext";
import { TbMinusVertical } from "react-icons/tb";
import './App.css'

function App() {
  const [count, setCount] = useState(0);
  const [showSideBar, setShowSideBar] = useState(true);

  return (
    <>
      <PageContextProvider>
        <Header />
        <div style={{ display: "flex" }}>
          {showSideBar && <Sidebar setShowSideBar={setShowSideBar}/>}
          {!showSideBar && <div className="sidebar-opener"><TbMinusVertical/></div>}
          <Page />
        </div>
      </PageContextProvider>
    </>
  );
}

export default App;

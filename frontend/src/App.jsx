import { useState, useEffect } from "react";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import Page from "./components/Pages/Page";
import { PageContextProvider } from "./components/Contexts/PageContext";
import { TbMinusVertical } from "react-icons/tb";
import "./App.css";
import { OrganizationProvider } from "./components/Contexts/OrganizationContext";
import { ProjectContextProvider } from "./components/Contexts/ProjectContext";

function App() {
  const [showSideBar, setShowSideBar] = useState(true);

  const toggleSidebar = () => {
    setShowSideBar((prev) => !prev);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check if Ctrl (or Cmd on Mac) is pressed along with the 'S' key
      if ((event.ctrlKey || event.metaKey) && event.key === "s") {
        event.preventDefault(); // Prevent the default browser save action
        toggleSidebar();
      }
    };

    // Add the event listener when the component mounts
    window.addEventListener("keydown", handleKeyDown);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <ProjectContextProvider>
      <OrganizationProvider>
        <PageContextProvider>
          <Header />
          <div
            style={{
              display: "flex",
              height: "100vh",
              width: "100%",
              position: "relative",
            }}
          >
            {showSideBar && (
              <Sidebar setShowSideBar={{ showSideBar, setShowSideBar }} />
            )}
            <div className="sidebar-opener">
              <TbMinusVertical onClick={toggleSidebar} />
            </div>
            <div className="page-container">
              <Page />
            </div>
          </div>
        </PageContextProvider>
      </OrganizationProvider>
    </ProjectContextProvider>
  );
}

export default App;

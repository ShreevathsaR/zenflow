import { useState, useEffect } from "react";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import Page from "./components/Pages/Page";
import { PageContextProvider } from "./components/Contexts/PageContext";
import { TbMinusVertical } from "react-icons/tb";
import "./App.css";
import { OrganizationProvider } from "./components/Contexts/OrganizationContext";
import { ProjectContextProvider } from "./components/Contexts/ProjectContext";
import { NotificationsProvider } from "./components/Contexts/NotificationContext";

function App() {
  const [showSideBar, setShowSideBar] = useState(true);

  const toggleSidebar = () => {
    setShowSideBar((prev) => !prev);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "s") {
        event.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <ProjectContextProvider>
      <OrganizationProvider>
        <PageContextProvider>
          <NotificationsProvider>
          {/* <Header /> */}
          <div
            style={{
              display: "flex",
              height: "100vh",
              width: "100%",
              position: "relative",
            }}
          >
            {showSideBar && (
              <Sidebar
                values={{ showSideBar, setShowSideBar }}
              />
            )}
            <div className="sidebar-opener">
              <TbMinusVertical onClick={toggleSidebar} />
            </div>
            <div className="page-container">
              <Page />
            </div>
          </div>
          </NotificationsProvider>
        </PageContextProvider>
      </OrganizationProvider>
    </ProjectContextProvider>
  );
}

export default App;

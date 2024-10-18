import { useState, useEffect } from "react";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import Page from "./components/Pages/Page";
import { PageContextProvider } from "./components/Contexts/PageContext";
import { TbMinusVertical } from "react-icons/tb";
import "./App.css";
import { OrganizationProvider } from "./components/Contexts/OrganizationContext";
import { ProjectContextProvider } from "./components/Contexts/ProjectContext";
import { io } from "socket.io-client";

function App() {
  const [showSideBar, setShowSideBar] = useState(true);
  const [socket, setSocket] = useState(null);

  const [notifications, setNotifications] = useState([]);

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

    const newSocket = io("http://localhost:8000");
    setSocket(newSocket);

    newSocket.on("connection", () => {
      console.log("Connected to server");
    });

    newSocket.on("notification", (data) => {
      console.log(data);
      setNotifications((prev) => [...prev, data]);
    });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      newSocket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    socket.emit("notification", "You are invited to an organization");
  };

  return (
    <ProjectContextProvider>
      <OrganizationProvider>
        <PageContextProvider>
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
                values={{ showSideBar, setShowSideBar, notifications }}
              />
            )}
            <div className="sidebar-opener">
              <TbMinusVertical onClick={toggleSidebar} />
            </div>
            <div className="page-container">
              <Page values={{ notifications, setNotifications }} />
            </div>
            <button onClick={sendMessage}>Send message</button>
          </div>
        </PageContextProvider>
      </OrganizationProvider>
    </ProjectContextProvider>
  );
}

export default App;

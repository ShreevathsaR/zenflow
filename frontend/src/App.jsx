import { useState } from "react";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import Page from "./components/Pages/Page";
import { PageContextProvider } from "./components/Contexts/PageContext";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <PageContextProvider>
        <Header />
        <div style={{ display: "flex" }}>
          <Sidebar />
          <Page />
        </div>
      </PageContextProvider>
    </>
  );
}

export default App;

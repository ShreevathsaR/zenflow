import React ,{ createContext, useContext, useState } from "react";

const ProjectContext = createContext();

export const ProjectContextProvider = ({ children }) => {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <ProjectContext.Provider value={{ selectedProject, setSelectedProject }}>
        {children}
    </ProjectContext.Provider>
  )
}

export const useProjectContext = () => {
  return useContext(ProjectContext);
};
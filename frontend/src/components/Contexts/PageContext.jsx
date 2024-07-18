import React, { createContext, useContext, useState } from "react";

const PageContext = createContext();

export const PageContextProvider = ({children}) => {
    
    const [page,setPage] = useState("");

    return(
        <PageContext.Provider value={{page,setPage}}>
            {children}
        </PageContext.Provider>
    )
}

export const usePageContext = () => useContext(PageContext);
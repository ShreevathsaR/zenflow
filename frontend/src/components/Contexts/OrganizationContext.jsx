import React, { createContext, useContext, useState } from 'react'

const OrganizationContext = createContext();

export const OrganizationProvider = ({ children }) => {

    const [selectedOrganization, setSelectedOrganization] = useState(null);

    return (
        <OrganizationContext.Provider value={{ selectedOrganization, setSelectedOrganization }}>
            {children}
        </OrganizationContext.Provider>
    )
}

export const useOrganization = () => useContext(OrganizationContext);

import { createContext, useContext, useState } from "react";

const NotificationsContext = createContext();

export const NotificationsProvider = ({children}) => {

  const [notifications, setNotifications] = useState([]);

  return (
    <NotificationsContext.Provider value={{notifications, setNotifications}}>
      {children}
    </NotificationsContext.Provider>
  )
}

export const useNotifications = () => useContext(NotificationsContext);
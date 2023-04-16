import { createContext, useState, useEffect, ReactNode } from "react";

const NotificationContext = createContext({
  notification: null, // { title, message, status }
  showNotification: function () {},
  hideNotification: function () {},
});

export function NotificationContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [activeNotification, setActiveNotification] = useState<null>(null);

  function showNotificationHandler() {
    setActiveNotification(null);
  }

  function hideNotificationHandler() {
    setActiveNotification(null);
  }

  const context = {
    notification: activeNotification,
    showNotification: showNotificationHandler,
    hideNotification: hideNotificationHandler,
  };

  return (
    <NotificationContext.Provider value={context}>
      {children}
    </NotificationContext.Provider>
  );
}

export default NotificationContext;

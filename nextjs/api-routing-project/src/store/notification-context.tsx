import { NotificationType } from "@/types/notification.type";
import { createContext, useState, useEffect, ReactNode } from "react";

const initialState = { title: "", message: "", status: "" };

const NotificationContext = createContext({
  notification: initialState, // { title, message, status }
  showNotification: function (notificationData: NotificationType) {},
  hideNotification: function () {},
});

export function NotificationContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [activeNotification, setActiveNotification] =
    useState<NotificationType>(initialState);

  useEffect(() => {
    if (
      activeNotification &&
      (activeNotification.status === "success" ||
        activeNotification.status === "error")
    ) {
      const timer = setTimeout(() => {
        setActiveNotification(initialState);
      }, 3000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [activeNotification]);

  function showNotificationHandler(notificationData: NotificationType) {
    setActiveNotification(notificationData);
  }

  function hideNotificationHandler() {
    setActiveNotification(initialState);
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

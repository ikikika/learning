import { useContext } from "react";

import classes from "./notification.module.css";
import NotificationContext from "../../store/notification-context";
import { NotificationType } from "@/types/notification.type";

function Notification(props: NotificationType) {
  const notificationCtx = useContext(NotificationContext); // call context

  const { title, message, status } = props;

  let statusClasses = "";

  if (status === "success") {
    statusClasses = classes.success;
  }

  if (status === "error") {
    statusClasses = classes.error;
  }

  if (status === "pending") {
    statusClasses = classes.pending;
  }

  const activeClasses = `${classes.notification} ${statusClasses}`;

  return (
    <div
      className={activeClasses}
      onClick={notificationCtx.hideNotification} // set on click action
    >
      <h2>{title}</h2>
      <p>{message}</p>
    </div>
  );
}

export default Notification;

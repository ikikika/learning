import { ReactNode } from "react";
import classes from "./event-content.module.css";

interface PropsType {
  children: ReactNode;
}

function EventContent(props: PropsType) {
  return <section className={classes.content}>{props.children}</section>;
}

export default EventContent;

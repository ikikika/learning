import { ReactNode } from "react";
import classes from "./logistics-item.module.css";

function LogisticsItem(props: {
  children: ReactNode;
  icon: () => JSX.Element;
}) {
  const { icon: Icon } = props;

  return (
    <li className={classes.item}>
      <span className={classes.icon}>{Icon ? <Icon /> : null}</span>
      <span className={classes.content}>{props.children}</span>
    </li>
  );
}

export default LogisticsItem;

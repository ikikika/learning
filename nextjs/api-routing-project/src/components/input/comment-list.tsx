import classes from "./comment-list.module.css";
import { CommentType } from "@/types/comment.type";

function CommentList(props: { items: CommentType[] }) {
  const { items } = props;

  return (
    <ul className={classes.comments}>
      {items.map((item) => (
        <li key={item.id}>
          <p>{item.text}</p>
          <div>
            By <address>{item.name}</address>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default CommentList;

import classes from "./comment-list.module.css";
import { CommentType } from "@/types/comment.type";

function CommentList(props: { items: ListCommentType[] }) {
  const { items } = props;

  return (
    <ul className={classes.comments}>
      {items.map((item) => (
        <li key={item._id}>
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

interface ListCommentType extends Omit<CommentType, "_id"> {
  _id?: string;
}

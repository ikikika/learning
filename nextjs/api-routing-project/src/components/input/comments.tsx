import { useContext, useEffect, useState } from "react";

import CommentList from "./comment-list";
import NewComment from "./new-comment";
import classes from "./comments.module.css";
import { CommentType } from "@/types/comment.type";
import NotificationContext from "@/store/notification-context";

function Comments(props: { eventId: string }) {
  const { eventId } = props;

  const notificationCtx = useContext(NotificationContext);

  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [reloadComments, setReloadComments] = useState(false);

  useEffect(() => {
    if (showComments) {
      fetch("/api/comments/" + eventId)
        .then((response) => response.json())
        .then((data) => {
          setComments(data.comments);
        });
    }
  }, [eventId, showComments, reloadComments]);

  function toggleCommentsHandler() {
    setShowComments((prevStatus) => !prevStatus);
  }

  function addCommentHandler(commentData: CommentType) {
    notificationCtx.showNotification({
      title: "Sending comment...",
      message: "Your comment is currently being stored into a database.",
      status: "pending",
    });

    fetch("/api/comments/" + eventId, {
      method: "POST",
      body: JSON.stringify(commentData),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        return response.json().then((data) => {
          throw new Error(data.message || "Something went wrong!");
        });
      })
      .then(() => {
        notificationCtx.showNotification({
          title: "Success!",
          message: "Your comment was saved!",
          status: "success",
        });
        setReloadComments((prevState) => !prevState);
      })
      .catch((error) => {
        notificationCtx.showNotification({
          title: "Error!",
          message: error.message || "Something went wrong!",
          status: "error",
        });
      });
  }

  return (
    <section className={classes.comments}>
      <button onClick={toggleCommentsHandler}>
        {showComments ? "Hide" : "Show"} Comments
      </button>
      {showComments && <NewComment onAddComment={addCommentHandler} />}
      {showComments && <CommentList items={comments} />}
    </section>
  );
}

export default Comments;

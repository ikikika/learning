import { useState } from "react";
import {
  FeedbackType,
  buildFeedbackPath,
  extractFeedback,
} from "../api/feedback";

function FeedbackPage(props: { feedbackItems: FeedbackType[] }) {
  const [feedbackData, setFeedbackData] = useState<FeedbackType>();

  function loadFeedbackHandler(id: string) {
    fetch(`/api/${id}`)
      .then((response) => response.json())
      .then((data) => setFeedbackData(data.feedback));
  }
  return (
    <>
    {
        feedbackData && <p>{feedbackData.email}: {feedbackData.text}</p>
    }
      <ul>
        {props.feedbackItems.map((item) => (
          <li key={item.id}>
            {item.email}{" "}
            <button onClick={loadFeedbackHandler.bind(null, item.id)}>
              Show details
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

export async function getStaticProps() {
  const filepath = buildFeedbackPath();
  const data = extractFeedback(filepath);

  return {
    props: {
      feedbackItems: data,
    },
  };
}

export default FeedbackPage;

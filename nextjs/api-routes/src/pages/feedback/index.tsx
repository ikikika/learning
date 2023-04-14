import {
  FeedbackType,
  buildFeedbackPath,
  extractFeedback,
} from "../api/feedback";

function FeedbackPage(props: { feedbackItems: FeedbackType[] }) {
  return (
    <ul>
      {props.feedbackItems.map((item) => (
        <li key={item.id}>
          {item.email}: {item.text}
        </li>
      ))}
    </ul>
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

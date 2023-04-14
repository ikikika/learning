import { useRef, useState } from "react";

export default function Home() {
  const emailInputRef = useRef<HTMLInputElement>(null);
  const feedbackInputRef = useRef<HTMLTextAreaElement>(null);
  const [feedbackItems, setFeedbackItems] = useState([]);

  function submitFormHandler(event: { preventDefault: () => void }) {
    event.preventDefault();

    const enteredEmail = emailInputRef.current!.value;
    const enteredFeedback = feedbackInputRef.current!.value;

    const reqBody = { email: enteredEmail, text: enteredFeedback };

    fetch("/api/feedback", {
      method: "POST",
      body: JSON.stringify(reqBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => console.log(data));
  }

  function loadFeecbackHandler() {
    fetch("/api/feedback")
      .then((response) => response.json())
      .then((data) => setFeedbackItems(data.feedback));
  }

  return (
    <>
      Home page
      <form onSubmit={submitFormHandler}>
        <input type="email" ref={emailInputRef} />
        <textarea ref={feedbackInputRef}></textarea>
        <button>Submit</button>
      </form>
      <button onClick={loadFeecbackHandler}>Load feedback</button>
      <ul>
        {feedbackItems.map((item: any) => (
          <li key={item.id}>
            {item.email}: {item.text}
          </li>
        ))}
      </ul>
    </>
  );
}

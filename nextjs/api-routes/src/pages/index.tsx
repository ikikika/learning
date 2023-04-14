import { useRef } from "react";

export default function Home() {
  const emailInputRef = useRef<HTMLInputElement>(null);
  const feedbackInputRef = useRef<HTMLTextAreaElement>(null);

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
      .then((response) => console.log(response));
  }

  return (
    <>
      Home page
      <form onSubmit={submitFormHandler}>
        <input type="email" ref={emailInputRef} />
        <textarea ref={feedbackInputRef}></textarea>
        <button>Submit</button>
      </form>
    </>
  );
}

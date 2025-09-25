"use client";
import { createSnippet } from "@/actions";
import { startTransition, useActionState } from "react";

export default function SnippetCreatePage() {
  const [formState, action] = useActionState(createSnippet, {
    message: "",
  });
  // always have 2 elements inside it
  // first one is formState, the object that is going to be updated and changed over time and communicated back to us from the server action
  // second one is updated version of our server action.
  // behind the scenes use form state takes the server action we provide right here and it wraps it up with a bunch of additional functionality and then it returns that updated version as the second element.

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => {
      action(formData);
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="font-bold m-3">Create a Snippet</h3>
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <label className="w-12" htmlFor="title">
            Title
          </label>
          <input
            name="title"
            className="border rounded p-2 w-full"
            id="title"
          />
        </div>

        <div className="flex gap-4">
          <label className="w-12" htmlFor="code">
            Code
          </label>
          <textarea
            name="code"
            className="border rounded p-2 w-full"
            id="code"
          />
        </div>

        {formState.message ? (
          <div className="my-2 p-2 bg-red-200 border rounded border-red-400">
            {formState.message}
          </div>
        ) : null}

        <button type="submit" className="rounded p-2 bg-blue-200">
          Create
        </button>
      </div>
    </form>
  );
}

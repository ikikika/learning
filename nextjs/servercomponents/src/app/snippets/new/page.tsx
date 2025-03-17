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

  return (
    <form action={action}>
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

        <div>{formState.message}</div>

        <button type="submit" className="rounded p-2 bg-blue-200">
          Create
        </button>
      </div>
    </form>
  );
}

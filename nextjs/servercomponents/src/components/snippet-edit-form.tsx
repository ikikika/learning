"use client";

import type { Snippet } from "@prisma/client";
import Editor from "@monaco-editor/react";
import { useState } from "react";
import * as actions from "@/actions";

interface SnippetEditFormProps {
  snippet: Snippet;
}

export default function SnippetEditForm({ snippet }: SnippetEditFormProps) {
  const [code, setCode] = useState(snippet.code);

  const handleEditorChange = (value: string = "") => {
    setCode(value);
  };

  // option 1
  // make sure editSnippet gets called w ith the code frim editor
  const editSnippetAction = actions.editSnippet.bind(null, snippet.id, code);
  // If you take a function and you call the bind function on it,
  // any arguments you pass in after the first one kind of reload the function, so to speak.
  // So we get a new version of our edit snippet action function.\
  // make a preloaded version of our server action.
  // Kind of a version of this function that's going to be called with some arguments already assigned to it.
  // The first argument to bind is always going to be null.
  
  return (
    <div>
      <Editor
        height="40vh"
        theme="vs-dark"
        language="javascript"
        defaultValue={snippet.code}
        options={{ minimap: { enabled: false } }}
        onChange={handleEditorChange}
      />
      <form action={editSnippetAction}>
        <button type="submit" className="p-2 border rounded">
          Save
        </button>
      </form>
    </div>
  );
}

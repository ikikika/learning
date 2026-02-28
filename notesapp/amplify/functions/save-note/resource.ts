import { defineFunction } from "@aws-amplify/backend";

export const saveNote = defineFunction({
  name: "save-note",
  entry: "./handler.ts",
});

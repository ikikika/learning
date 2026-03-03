import { defineFunction } from "@aws-amplify/backend";

export const saveNote = defineFunction({
  name: "save-note",
  entry: "./handler.ts",
  // Keep function in the storage nested stack to avoid CFN cycles between
  // storage (IAM access to the function) and the function (bucket env var).
  resourceGroupName: "storage",
});

import { defineStorage } from "@aws-amplify/backend";
import { saveNote } from "../functions/save-note/resource";

export const storage = defineStorage({
  name: "notesStorage",
  access: (allow) => ({
    "notes/*": [allow.resource(saveNote).to(["write"])],
  }),
});

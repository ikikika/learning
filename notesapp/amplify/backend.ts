import { defineBackend } from "@aws-amplify/backend";
import { Stack } from "aws-cdk-lib";
import {
  AuthorizationType,
  Cors,
  LambdaIntegration,
  RestApi,
} from "aws-cdk-lib/aws-apigateway";
import { saveNote } from "./functions/save-note/resource";
import { storage } from "./storage/resource";

const backend = defineBackend({
  storage,
  saveNote,
});

backend.saveNote.addEnvironment(
  "NOTES_BUCKET_NAME",
  backend.storage.resources.bucket.bucketName
);

// Define the REST API in the same stack as the Lambda (storage group) so
// API Gateway invoke permissions do not create a nested-stack cycle.
const apiStack = Stack.of(backend.saveNote.resources.lambda);

const notesApi = new RestApi(apiStack, "NotesApi", {
  restApiName: "notesApi",
  deploy: true,
  deployOptions: {
    stageName: "prod",
  },
  defaultCorsPreflightOptions: {
    allowOrigins: Cors.ALL_ORIGINS,
    allowMethods: ["POST", "OPTIONS"],
    allowHeaders: Cors.DEFAULT_HEADERS,
  },
});

const lambdaIntegration = new LambdaIntegration(
  backend.saveNote.resources.lambda
);

const notesPath = notesApi.root.addResource("notes", {
  defaultMethodOptions: {
    authorizationType: AuthorizationType.NONE,
  },
});

notesPath.addMethod("POST", lambdaIntegration);

backend.addOutput({
  custom: {
    notesApiUrl: notesApi.url.replace(/\/$/, ""),
  },
});

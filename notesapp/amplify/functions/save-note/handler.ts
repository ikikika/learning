import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import type { APIGatewayProxyHandler } from "aws-lambda";

const s3 = new S3Client({});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
  "Content-Type": "application/json",
};

function jsonResponse(statusCode: number, body: Record<string, unknown>) {
  return {
    statusCode,
    headers: corsHeaders,
    body: JSON.stringify(body),
  };
}

function extractContent(eventBody: string | null): string | null {
  if (eventBody == null || eventBody === "") return null;

  try {
    const parsed = JSON.parse(eventBody) as { content?: unknown };
    if (typeof parsed?.content === "string") {
      return parsed.content;
    }
  } catch {
    // Treat non-JSON body as raw text.
  }

  return eventBody;
}

function noteKey(): string {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  return `notes/note-${stamp}.txt`;
}

export const handler: APIGatewayProxyHandler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { error: "Method not allowed" });
  }

  const bucket = process.env.NOTES_BUCKET_NAME;
  if (!bucket) {
    console.error("NOTES_BUCKET_NAME is not set");
    return jsonResponse(500, { error: "Server misconfigured" });
  }

  const content = extractContent(event.body);
  if (content == null || content.trim() === "") {
    return jsonResponse(400, { error: "Content is required" });
  }

  const key = noteKey();

  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: content,
        ContentType: "text/plain; charset=utf-8",
      })
    );
  } catch (err) {
    console.error("Failed to write note to S3", err);
    return jsonResponse(500, { error: "Failed to save note" });
  }

  return jsonResponse(200, { ok: true, key });
};

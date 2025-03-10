import { notFound } from "next/navigation";
import { db } from "@/db";

interface SnippetShowPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function SnippetShowPage(props: SnippetShowPageProps) {
  const { id } = await props.params;

  const snippet = await db.snippet.findFirst({
    where: { id: parseInt(id) },
  });
  if (!snippet) {
    return notFound();
  }

  return <div>{snippet.title}</div>;
}

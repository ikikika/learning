import { notFound } from "next/navigation";
import { db } from "@/db";
import SnippetEditForm from "@/components/snippet-edit-form";


interface SnippetEditPageProps {
  params: Promise<{
    id: string;
  }>; // must be a Promise
}

export default async function SnippetEditPage(props: SnippetEditPageProps) {
  const { id } = await props.params; // must have await

  const snippetId = parseInt(id);
  const snippet = await db.snippet.findFirst({
    where: { id: snippetId },
  });

  if (!snippet) {
    return notFound();
  }

  return (
    <div>
      {/* use client component in a server  component */}
      <SnippetEditForm snippet={snippet} />
    </div>
  );
}

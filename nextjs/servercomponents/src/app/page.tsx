import { db } from "@/db";
import Link from "next/link";

// This is a dynamic route that will always be revalidated on every request
// and will not be cached. This is useful for pages that need to be
// updated frequently, such as a dashboard or a page that displays
// real-time data. By setting `dynamic` to 'force-dynamic', we ensure
// that the page is always generated on the server and not cached by
// the client or CDN.
export const dynamic = "force-dynamic";

export default async function Home() {
  const snippets = await db.snippet.findMany();

  const renderedSnippets = snippets.map((snippet) => {
    return (
      <Link
        key={snippet.id}
        href={`/snippets/${snippet.id}`}
        className="flex justify-between items-center p-2 border rounded"
      >
        <div>{snippet.title}</div>
        <div>View</div>
      </Link>
    );
  });

  return (
    <div>
      <div className="flex m-2 justify-between items-center">
        <h1 className="text-xl font-bold">Snippets</h1>
        <Link href="/snippets/new" className="border p-2 rounded">
          New
        </Link>
      </div>
      <div className="flex flex-col gap-2">{renderedSnippets}</div>
    </div>
  );
}

"use server";

import { redirect } from "next/navigation";
import { db } from "@/db";
import { revalidatePath } from "next/cache";

// before applying revalidatePath, when we update the data for each of these, or when we make some kind of update, do we need to refresh the data on the page?

export async function editSnippet(id: number, code: string) {
  await db.snippet.update({
    where: { id },
    data: { code },
  });

  // force the page to revalidate
  revalidatePath(`/snippets/${id}`);
  redirect(`/snippets/${id}`);
}

export async function deleteSnippet(id: number) {
  await db.snippet.delete({
    where: { id },
  });
  revalidatePath('/');
  redirect("/");
}

export async function createSnippet(
  formState: { message: string },
  formData: FormData
) {
  try {
    // Check the user's inputs and make sure they're valid
    const title = formData.get("title");
    const code = formData.get("code");

    if (typeof title !== "string" || title.length < 3) {
      return {
        message: "Title must be longer",
      };
    }
    if (typeof code !== "string" || code.length < 10) {
      return {
        message: "Code must be longer",
      };
    }
    // Create a new record in the database
    await db.snippet.create({
      data: {
        title,
        code,
      },
    });

    // throw new Error("This is an error");
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        message: err.message,
      };
    } else {
      return {
        message: "Something went wrong...",
      };
    }
  }

  revalidatePath('/');
  // // Redirect the user back to the root route
  // we do not want to put our redirect statements into a trycatch.
  // always leave them outside
  redirect("/");
}

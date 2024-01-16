import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  Link,
  isRouteErrorResponse,
  useFetcher,
  useLoaderData,
  useParams,
  useRouteError,
} from "@remix-run/react";

import invariant from "tiny-invariant";

import {
  deleteNote,
  getNote,
  getNoteListItems,
  toggleNoteFavourite,
} from "~/models/note.server";
import { requireUserId } from "~/session.server";

export const headers = () => {
  return {
    "Cache-Control": "public, max-age=60, s-maxage=600",
  };
};

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  invariant(params.noteId, "noteId not found");
  const note = await getNote({ id: params.noteId, userId });
  if (!note) {
    throw new Response("Internal Server Error", { status: 404 });
  }

  return json(
    { note },
    { headers: { "Cache-Control": "private, max-age=60" } },
  );
};

export default function NoteDetailsPage() {
  const data = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  const isSubmitting =
    fetcher.state === "submitting" || fetcher.state === "loading";

  return (
    <div>
      <div className="flex justify-between">
        <h3 className="text-2xl font-bold">{data.note.title}</h3>

        <button
          className="text-red-500"
          onClick={async () => {
            fetcher.submit({}, { method: "POST" });
          }}
        >
          {isSubmitting
            ? data.note.isFavorite
              ? "🤍"
              : "❤️"
            : data.note.isFavorite
            ? "❤️"
            : "🤍"}
        </button>
      </div>
      <p className="py-6">{data.note.body}</p>
      <hr className="my-4" />
      <Form method="DELETE">
        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Delete
        </button>
      </Form>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const { noteId } = useParams();

  if (error instanceof Error) {
    return <div>An unexpected error occurred: {error.message}</div>;
  }

  if (isRouteErrorResponse(error))
    if (error.status === 404) {
      return (
        <div className="text-red-900 bg-red-100 p-2 rounded-lg text-center">
          <p>Note not found for id: {noteId}</p>
          <Link
            className="border-red-800 text-red-50 bg-red-900 p-3 rounded-lg inline-block my-2"
            to="/notes"
          >
            Browse all notes
          </Link>
        </div>
      );
    } else {
      return <div>An unexpected error occurred: {error.statusText}</div>;
    }

  return <div>Unknown Error</div>;
}

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);
  invariant(params.noteId, "noteId not found");

  if (request.method === "DELETE") {
    await deleteNote({ id: params.noteId, userId });
    const newNotes = await getNoteListItems({ userId });
    console.log("NEW NOTES", newNotes);

    return redirect("/notes");
  } else if (request.method === "POST") {
    // return new Response("Error", { status: 500 });
    const note = await toggleNoteFavourite({ id: params.noteId, userId });
    return json({ success: true, note });
  } else {
    return new Response("Method Not Allowed", { status: 405 });
  }
};

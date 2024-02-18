"use client";
import he from "he";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import type { FormEventHandler } from "react";
import { DateTime } from "luxon";

function PostsPage({ params }: { params: { postId: string } }) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["posts", params.postId],
    queryFn: async () => {
      const rawRes = await fetch(
        `http://localhost:3010/posts/${params.postId}`,
        {
          method: "GET",
          mode: "cors",
          credentials: "include",
        },
      );
      const res = await rawRes.json();
      if (res.success) {
        return res.post;
      } else {
        throw new Error(`Error fetching post ${params.postId}`);
      }
    },
  });
  const mutation = useMutation({
    mutationFn: (payload: any) => {
      return fetch(`http://localhost:3010/posts/${params.postId}`, {
        method: "PUT",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(payload),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts", params.postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: () => {
      console.log("there was an error in updating the document.");
    },
  });

  const onSubmitHandler: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form as HTMLFormElement);
    // keep in mind that in FormData. if the checkbox is unchecked
    // then 'isPublished' is not there. use formData.has() to check
    // if the checkbox is checked. this will give you the boolean
    // for isPublished.
    // add useMutation here to mutate this query state data
    const payload = {
      title: formData.get("title"),
      body: formData.get("body"),
      isPublished: formData.has("isPublished"),
    };
    mutation.mutate(payload);
    setIsEditing((bool) => !bool);
  };

  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-14">
      {isLoading ? <h1>The post is loading...</h1> : null}
      {isError ? <h1>The post had an error during loading</h1> : null}
      {data ? (
        <div className="mx-auto flex max-w-4xl flex-col gap-6">
          <h1 className="text-center text-3xl font-semibold">
            Post ID: {params.postId}
          </h1>
          <div className="grid grid-cols-6 items-start gap-4">
            {/* grid layout here */}
            <div className="col-span-4 flex flex-col gap-4 rounded-md border border-zinc-300 bg-zinc-50 px-4 py-6">
              {/* post content block */}
              {isEditing ? (
                <form
                  className="flex flex-col gap-4"
                  onSubmit={onSubmitHandler}
                >
                  <div className="flex flex-col gap-2">
                    <label htmlFor="title" className="font-medium">
                      Title:
                    </label>
                    <input
                      type="text"
                      name="title"
                      id="title"
                      className="rounded-md border border-zinc-300 px-4 py-2 text-base"
                      defaultValue={data.title ? he.decode(data.title) : ""}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="body" className="font-medium">
                      Body:
                    </label>
                    <textarea
                      name="body"
                      id="body"
                      cols={30}
                      rows={10}
                      className="rounded-md border border-zinc-300 px-4 py-2 text-base"
                      defaultValue={data.body ? he.decode(data.body) : ""}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="isPublished" className="font-medium">
                      isPublished:
                    </label>
                    <input
                      type="checkbox"
                      name="isPublished"
                      id="isPublished"
                      className="h-4 w-4"
                      defaultChecked={
                        data.isPublished ? data.isPublished : false
                      }
                      value="true"
                    />
                  </div>
                  <button
                    type="submit"
                    className="self-start rounded-md border-2 border-zinc-800 px-6 py-2 font-semibold text-zinc-800"
                  >
                    Save
                  </button>
                </form>
              ) : (
                <>
                  <h2 className="text-4xl font-semibold">
                    {he.decode(data.title)}
                  </h2>
                  <div className="flex justify-evenly">
                    <p className="text-sm text-zinc-800">
                      Created At:{" "}
                      {DateTime.fromISO(data.createdAt).toLocaleString(
                        DateTime.DATETIME_MED,
                      )}
                    </p>
                    <p className="text-sm text-zinc-800">
                      Updated At:{" "}
                      {DateTime.fromISO(data.updatedAt).toLocaleString(
                        DateTime.DATETIME_MED,
                      )}
                    </p>
                  </div>
                  <p className="whitespace-pre-line">{he.decode(data.body)}</p>
                </>
              )}
            </div>
            <div className="col-span-2 flex justify-evenly gap-3 rounded-md border border-zinc-300 bg-zinc-50 px-4 py-6">
              {/* edit and delete buttons */}
              {isEditing ? (
                <>
                  <button
                    type="button"
                    className="rounded-md bg-red-600 px-6 py-2 font-semibold text-zinc-50"
                    onClick={() => setIsEditing((bool) => !bool)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="rounded-md border-2 border-zinc-800 px-6 py-2 font-semibold text-zinc-800"
                    onClick={() => setIsEditing((bool) => !bool)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="rounded-md bg-red-600 px-6 py-2 font-semibold text-zinc-50"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}

export default PostsPage;

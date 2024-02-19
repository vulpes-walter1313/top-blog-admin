"use client";
import he from "he";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import type { FormEventHandler } from "react";
import { DateTime } from "luxon";
import Link from "next/link";
import { useRouter } from "next/navigation";

function CreatePostPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (payload: any) => {
      return fetch(`http://localhost:3010/posts/`, {
        method: "POST",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      router.push("/posts");
    },
    onError: () => {
      console.log("there was an error in creating the document.");
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
    const payload = {
      title: formData.get("title"),
      body: formData.get("body"),
      isPublished: formData.has("isPublished"),
    };
    mutation.mutate(payload);
  };

  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-14">
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <h1 className="text-center text-3xl font-semibold">Create a Post</h1>
        <div className="flex flex-col gap-4 rounded-md border border-zinc-300 bg-zinc-50 px-4 py-6">
          {/* post content block */}
          <form className="flex flex-col gap-4" onSubmit={onSubmitHandler}>
            <div className="flex flex-col gap-2">
              <label htmlFor="title" className="font-medium">
                Title:
              </label>
              <input
                type="text"
                name="title"
                id="title"
                className="rounded-md border border-zinc-300 px-4 py-2 text-base"
                defaultValue=""
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
                defaultValue=""
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
                defaultChecked={false}
                value="true"
              />
            </div>
            <div className="flex items-start gap-4">
              <button
                type="submit"
                className="self-start rounded-md border-2 border-zinc-800 px-6 py-2 font-semibold text-zinc-800"
              >
                Save
              </button>
              <Link
                className="rounded-md bg-red-600 px-6 py-2 font-semibold text-zinc-50"
                href="/posts"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

export default CreatePostPage;

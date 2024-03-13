"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import he from "he";
import { useSearchParams } from "next/navigation";
import PaginationLinks from "./PaginationLinks";

type PostType = {
  _id: string;
  title: string;
  body: string;
  author: {
    name: string;
  };
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
};
type FilterStateType = "all" | "published" | "unpublished";
function PostsPage() {
  const pageParams = useSearchParams() || 1;
  const [filterState, setFilterState] = useState<FilterStateType>("all");
  const { data, isLoading, isError } = useQuery({
    queryKey: ["posts", `${pageParams.get("page") || "1"}`],
    queryFn: async () => {
      const rawRes = await fetch(
        `http://localhost:3010/posts?page=${pageParams.get("page") || "1"}`,
        {
          credentials: "include",
          mode: "cors",
        },
      );
      const data = await rawRes.json();
      if (data.success == false) {
        throw new Error("error getting data from /posts");
      }
      console.log(data);
      return {
        posts: data.posts,
        totalPages: data.totalPages,
        currentPage: data.currentPage,
      };
    },
  });

  if (isLoading) {
    return <h1 className="text-5xl font-bold">The posts are coming in hot!</h1>;
  }

  if (isError) {
    return (
      <h1 className="text-5xl font-bold">
        The posts were too hot, there was an error
      </h1>
    );
  }
  return (
    <div className="min-h-screen bg-zinc-100 px-4 py-16">
      <div className="mx-auto flex max-w-4xl flex-col items-center">
        <h1 className="pb-8 text-5xl font-bold">Posts Page</h1>
        <div className="grid grid-cols-7 items-start">
          <div className="col-span-1 col-start-1 rounded-md border border-zinc-300 bg-zinc-50 px-4 py-6">
            <h3 className="text-xl font-medium">Filters</h3>
            <ul>
              <li
                className={`cursor-pointer ${filterState === "all" ? "font-bold" : ""}`}
                onClick={() => setFilterState("all")}
              >
                All
              </li>
              <li
                className={`cursor-pointer ${filterState === "published" ? "font-bold" : ""}`}
                onClick={() => setFilterState("published")}
              >
                Published
              </li>
              <li
                className={`cursor-pointer ${filterState === "unpublished" ? "font-bold" : ""}`}
                onClick={() => setFilterState("unpublished")}
              >
                Unpublished
              </li>
            </ul>
          </div>
          <div className="col-span-5 col-start-3 flex flex-col gap-4">
            {data?.posts
              ?.filter((post: PostType) => {
                if (filterState === "all") {
                  return true;
                } else if (filterState === "published") {
                  return post.isPublished;
                } else {
                  // unpublished
                  return !post.isPublished;
                }
              })
              .toSorted((a: any, b: any) => {
                const aDate = new Date(a.updatedAt);
                const bDate = new Date(b.updatedAt);
                return bDate.getTime() - aDate.getTime();
              })
              .map((post: PostType) => {
                return (
                  <div
                    key={post._id}
                    className="flex flex-col items-start rounded-md border border-zinc-300 bg-zinc-50 px-4 py-6"
                  >
                    <h2 className="pb-2 text-3xl font-semibold text-zinc-900">
                      <Link
                        href={`/posts/${post._id}`}
                        className="hover:text-blue-700 hover:underline"
                      >
                        {he.decode(post.title)}
                      </Link>
                    </h2>
                    <p className="pb-2 text-zinc-800">
                      {he.decode(post.body.slice(0, 80)) + "..."}
                    </p>
                    <Link
                      href={`/posts/${post._id}`}
                      className="rounded-md border-2 border-indigo-700 px-6 py-2 text-indigo-700"
                    >
                      View
                    </Link>
                  </div>
                );
              })}
          </div>
        </div>
        <div className="py-4">
          {data ? (
            <PaginationLinks
              totalPages={data.totalPages}
              currentPage={parseInt(pageParams.get("page") || "1")}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default PostsPage;

"use client";
import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";

function Navbar() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data, isLoading, isError, status } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const rawData = await fetch(`http://localhost:3010/currentuser`, {
        mode: "cors",
        credentials: "include",
      });
      const data = await rawData.json();
      if (data.success) {
        return data;
      } else {
        throw new Error("user is not logged in");
      }
    },
  });
  const logoutMutation = useMutation({
    mutationFn: () => {
      return fetch("http://localhost:3010/logout", {
        mode: "cors",
        credentials: "include",
        method: "GET",
      });
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["user"] });
      router.push("/");
    },
  });
  return (
    <nav className="border-b border-zinc-400">
      <div className="mx-auto flex max-w-4xl items-center justify-between py-4">
        <p className="text-3xl font-bold text-zinc-800">Blog Content</p>
        {status === "success" && data ? (
          <ul className="flex items-center gap-4">
            <li>
              <Link href="/posts">Posts</Link>
            </li>
            <li>
              <button
                type="button"
                className="rounded-md bg-indigo-600 px-6 py-2 font-semibold text-zinc-50"
                onClick={() => logoutMutation.mutate()}
              >
                Logout
              </button>
            </li>
          </ul>
        ) : null}
      </div>
    </nav>
  );
}

export default Navbar;

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserStateFromServer } from "@/lib/fetchFunctions";
import Link from "next/link";

export default function Home() {
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const router = useRouter();
  const { data, isLoading, isError, isRefetchError } = useQuery({
    queryKey: ["user"],
    queryFn: getUserStateFromServer,
  });
  const loginMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      setLoginError(null);
      const rawRes = await fetch("http://localhost:3010/login", {
        method: "POST",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const res = await rawRes.json();
      if (res.success) {
        return res;
      } else {
        let messageErr: string;
        if (res.errors && Array.isArray(res.errors)) {
          messageErr = res.errors[0].message;
        } else {
          messageErr = res.errors.message;
        }
        throw new Error(messageErr);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      router.push("/posts");
    },
    onError: (err) => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      setLoginError(err.message);
      console.dir(err);
    },
  });

  const onSubmitFunc = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    loginMutation.mutate({ email: email, password: password });
  };

  return (
    <main className="mx-auto flex max-w-5xl flex-col items-center justify-center p-24">
      <h1 className="pb-6 text-4xl font-bold">Blog Content Portal</h1>
      {loginError ? <p>{loginError}</p> : null}
      {isRefetchError || !data ? (
        <form
          className="flex flex-col gap-4 rounded-md border border-zinc-300 px-6 py-8"
          onSubmit={onSubmitFunc}
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="font-semibold">
              Email:
            </label>
            <input
              type="email"
              value={email}
              placeholder="your email..."
              onChange={(event) => setEmail(event.target.value)}
              name="email"
              id="email"
              className="rounded-md border border-zinc-300 px-4 py-2 text-base"
              autoComplete="username"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="font-semibold">
              Password:
            </label>
            <input
              type="password"
              value={password}
              placeholder="your password..."
              onChange={(event) => setPassword(event.target.value)}
              name="password"
              id="password"
              className="rounded-md border border-zinc-300 px-4 py-2 text-base"
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-6 py-2 text-zinc-50"
          >
            Login
          </button>
        </form>
      ) : (
        <div>
          <h2>You&apos;re already logged in.</h2>
          <Link
            href="/posts"
            className="rounded-md bg-indigo-600 px-6 py-2 font-semibold text-zinc-50"
          >
            See All Posts
          </Link>
        </div>
      )}
    </main>
  );
}

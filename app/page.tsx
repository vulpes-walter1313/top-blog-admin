"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const router = useRouter()

  const onSubmitFunc = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetch("http://localhost:3010/login", {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if (res.success === true) {
          setLoginError(null);
          router.push("/posts");
        } else {
          setLoginError("you got an error");
        }
      })
      .catch((err) => console.error(err));
  }

  return (
    <main className="max-w-5xl mx-auto flex flex-col justify-center items-center p-24">
      <h1 className="text-4xl font-bold pb-6">Blog Content Portal</h1>
      {loginError ? <p>You got an error</p> : null}
      <form
        className="border border-zinc-300 rounded-md px-6 py-8 flex flex-col gap-4"
        onSubmit={onSubmitFunc}
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="font-semibold">Email:</label>
          <input
            type="email"
            value={email}
            placeholder="your email..."
            onChange={(event) => setEmail(event.target.value)}
            name="email"
            id="email"
            className="border border-zinc-300 rounded-md py-2 px-4 text-base"
            autoComplete="username"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="font-semibold">Password:</label>
          <input
            type="password"
            value={password}
            placeholder="your password..."
            onChange={(event) => setPassword(event.target.value)}
            name="password"
            id="password"
            className="border border-zinc-300 rounded-md py-2 px-4 text-base"
            autoComplete="current-password"
          />
        </div>
        <button type="submit" className="px-6 py-2 bg-indigo-600 text-zinc-50 rounded-md">Login</button>
      </form>
    </main>
  );
}

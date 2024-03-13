"use client";
import {
  getUserStateFromServer,
  logoutMutationFunc,
} from "@/lib/fetchFunctions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

function AdminCheck({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, isError, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: getUserStateFromServer,
  });
  const logoutMutation = useMutation({
    mutationFn: logoutMutationFunc,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["user"] });
      router.push("/");
    },
  });
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return (
      <div>
        There seems to be an error. Go back to <Link href="/">login</Link>
      </div>
    );
  }
  if (data) {
    if (data.isAdmin === true) {
      return <>{children}</>;
    } else {
      return (
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-center py-14">
          <h1 className="text-4xl font-bold">You&apos;re not an admin.</h1>
          <p>Please Log out</p>
          <button
            type="button"
            className="my-4 rounded-md bg-indigo-600 px-6 py-2 font-semibold text-zinc-50"
            onClick={() => logoutMutation.mutate()}
          >
            Log out
          </button>
        </div>
      );
    }
  }
  return (
    <div>
      <h1>Please Login before procceding</h1>
      <Link href="/">Login</Link>
    </div>
  );
}

export default AdminCheck;

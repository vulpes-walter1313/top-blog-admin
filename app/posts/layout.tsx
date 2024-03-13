import { Adamina } from "next/font/google";
import React from "react";
import AdminCheck from "./AdminCheck";

export default function PostsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <AdminCheck>{children}</AdminCheck>
    </div>
  );
}

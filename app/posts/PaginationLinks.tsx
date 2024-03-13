import { NumberUnitLength } from "luxon";
import Link from "next/link";
import React from "react";

type PaginationLinksProps = {
  totalPages: number;
  currentPage: number;
};

function PaginationLinks({ totalPages, currentPage }: PaginationLinksProps) {
  let pageNums: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNums.push(i);
  }
  return (
    <ul className="flex gap-4">
      {pageNums.map((num) => {
        return (
          <li
            key={num}
            className={`${num === currentPage ? "font-bold underline" : ""}`}
          >
            <Link href={`/posts?page=${num}`}>{num}</Link>
          </li>
        );
      })}
    </ul>
  );
}

export default PaginationLinks;

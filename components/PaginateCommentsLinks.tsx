import React from "react";

type PaginateCommentsLinksProps = {
  totalPages: number;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
};
function PaginateCommentsLinks({
  totalPages,
  currentPage,
  setCurrentPage,
}: PaginateCommentsLinksProps) {
  let pageNums: number[] = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNums.push(i);
  }
  return (
    <ul className="flex gap-4">
      {pageNums.map((num) => (
        <li
          key={num}
          onClick={() => setCurrentPage(num)}
          className={`${currentPage === num ? "font-bold" : ""} cursor-pointer`}
        >
          {num}
        </li>
      ))}
    </ul>
  );
}

export default PaginateCommentsLinks;

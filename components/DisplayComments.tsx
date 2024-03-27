"use client";
import he from "he";
import { deleteComment, getCommentsFromPost } from "@/lib/fetchFunctions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DateTime } from "luxon";
import React, { useState } from "react";
import PaginateCommentsLinks from "./PaginateCommentsLinks";

type DisplayCommentsProps = {
  postId: string;
};
type CommentType = {
  _id: string;
  commentAuthor: {
    _id: string;
    name: string;
  };
  postId: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};
function DisplayComments({ postId }: DisplayCommentsProps) {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const commentsQuery = useQuery({
    queryKey: ["comments", postId, currentPage],
    queryFn: async () => {
      const data = await getCommentsFromPost(postId, currentPage);
      return data;
    },
  });
  const commentDeleteMutation = useMutation({
    mutationFn: async (payload: { postId: string; commentId: string }) => {
      try {
        const res = await deleteComment(payload.postId, payload.commentId);
        return res;
      } catch (err) {
        console.log(err);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });

  return (
    <div className="border border-slate-300 bg-slate-50 px-4 py-6 text-slate-950">
      {commentsQuery.data ? (
        <h3 className="text-3xl font-bold">
          {commentsQuery.data.numComments} Comments
        </h3>
      ) : null}
      {commentsQuery.isLoading ? (
        <p>Please wait as the comments are loading...</p>
      ) : null}
      <div className="flex flex-col gap-4">
        {commentsQuery.data && commentsQuery.status === "success"
          ? commentsQuery.data.comments.map((comment: CommentType) => {
              return (
                <div
                  key={comment._id}
                  className="border-l-4 border-violet-600 p-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p>{he.decode(comment.commentAuthor.name)}</p>
                      <p className="text-xs text-slate-600">
                        Created At:{" "}
                        {DateTime.fromISO(comment.createdAt).toLocaleString(
                          DateTime.DATETIME_MED,
                        )}
                      </p>
                      <p className="text-xs text-slate-600">
                        Updated At:{" "}
                        {DateTime.fromISO(comment.updatedAt).toLocaleString(
                          DateTime.DATETIME_MED,
                        )}
                      </p>
                    </div>
                    <button
                      className="text-red-500 underline"
                      onClick={() =>
                        commentDeleteMutation.mutate({
                          postId,
                          commentId: comment._id,
                        })
                      }
                    >
                      Delete
                    </button>
                  </div>
                  <p>{he.decode(comment.body)}</p>
                </div>
              );
            })
          : null}
      </div>
      {commentsQuery.data ? (
        <PaginateCommentsLinks
          totalPages={commentsQuery.data.totalPages}
          currentPage={commentsQuery.data.currentPage}
          setCurrentPage={setCurrentPage}
        />
      ) : null}
    </div>
  );
}

export default DisplayComments;

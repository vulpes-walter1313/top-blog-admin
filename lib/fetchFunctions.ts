export const getUserStateFromServer = async () => {
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
};

export const logoutMutationFunc = () => {
  return fetch("http://localhost:3010/logout", {
    mode: "cors",
    credentials: "include",
    method: "GET",
  });
};

export async function getCommentsFromPost(postId: string, page: number) {
  const rawRes = await fetch(
    `http://localhost:3010/posts/${postId}/comments?page=${page}`,
    {
      mode: "cors",
      credentials: "include",
      method: "GET",
    },
  );
  const res = await rawRes.json();
  if (!res.success) {
    throw new Error(`error from fetching comments from post: ${postId}`);
  } else {
    return res;
  }
}

export async function deleteComment(postId: string, commentId: string) {
  const rawRes = await fetch(
    `http://localhost:3010/posts/${postId}/comments/${commentId}`,
    {
      mode: "cors",
      credentials: "include",
      method: "DELETE",
    },
  );
  const res = await rawRes.json();
  if (!res.success) {
    throw new Error(`error deleting comment ${commentId}`);
  } else {
    return res;
  }
}

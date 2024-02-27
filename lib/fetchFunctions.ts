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

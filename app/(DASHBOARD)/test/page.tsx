import { getOnlineUsers } from "@/data/ga";
import React from "react";

const page = async () => {
  const res = await getOnlineUsers();

  console.log(res.data);

  return <div>{res.data}</div>;
};

export default page;

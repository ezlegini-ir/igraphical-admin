import prisma from "@/prisma/client";

const page = async () => {
  const user = await prisma.user.findFirst();

  return <div>{user?.firstName}</div>;
};

export default page;

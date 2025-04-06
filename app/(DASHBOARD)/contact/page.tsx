import Filter from "@/components/Filter";
import Search from "@/components/Search";
import { globalPageSize, pagination } from "@/data/pagination";
import { prisma } from "@igraphical/core";
import { ContactStatus, Prisma } from "@prisma/client";
import PostsList from "./ContactsList";
interface Props {
  searchParams: Promise<{ page: string; status: string; search: string }>;
}

const page = async ({ searchParams }: Props) => {
  const { page, status, search } = await searchParams;

  const where: Prisma.ContactWhereInput = {
    status: status as ContactStatus,
    OR: search
      ? [{ phone: { contains: search } }, { email: { contains: search } }]
      : undefined,
  };

  const { skip, take } = pagination(page);
  const contacts = await prisma.contact.findMany({
    where,
    include: {
      ContactResponse: true,
    },
    orderBy: { id: "desc" },
    skip,
    take,
  });
  const totalContacts = await prisma.contact.count({ where });

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:items-center">
        <h3>{totalContacts} Posts</h3>
        <div className="flex gap-3 justify-between items-center">
          <Search placeholder="Seach Email or Phone..." />

          <Filter
            placeholder="All Contacts"
            name="status"
            options={[
              { label: "Pending", value: "PENDING" },
              { label: "Replied", value: "REPLIED" },
            ]}
          />
        </div>
      </div>

      <PostsList
        contacts={contacts}
        totalContacts={totalContacts}
        pageSize={globalPageSize}
      />
    </div>
  );
};

export default page;

"use client";

import { searchUsers } from "@/data/search";
import { getUserById } from "@/data/user";
import { User } from "@prisma/client";
import { useEffect, useState } from "react";
import SearchField from "./forms/SearchField";

const SearchPosts = ({ field, userId }: { field: any; userId?: number }) => {
  const [defaultUser, setDefaultUser] = useState<User | undefined>(undefined);

  const fetchUsers = async (query: string): Promise<User[]> => {
    return await searchUsers(query);
  };

  useEffect(() => {
    const fetchSelectedUser = async () => {
      if (userId) {
        const user = await getUserById(userId);
        setDefaultUser(user ? user : undefined);
      }
    };
    fetchSelectedUser();
  }, [userId]);

  return (
    <SearchField<User>
      placeholder="Search Users..."
      fetchResults={fetchUsers}
      onSelect={(user) =>
        user ? field.onChange(user.id) : field.onChange(undefined)
      }
      getItemLabel={(user) => `${user.fullName} - ${user.email}`}
      defaultItem={defaultUser}
    />
  );
};

export default SearchPosts;

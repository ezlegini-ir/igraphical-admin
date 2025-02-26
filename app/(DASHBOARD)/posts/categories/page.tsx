import NewButton from "@/components/NewButton";
import React from "react";
import CategoriesList from "./CategoriesList";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CategoryForm from "@/components/forms/dashboard/post/CategoryForm";

interface Props {
  searchParams: Promise<{ page: string }>;
}

const totalPosts = 15;

const page = async ({ searchParams }: Props) => {
  const { page } = await searchParams;
  const totalCategories = 5;

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3>Categories</h3>
        <div className="flex gap-3 justify-between items-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button size={"sm"} className="px-6 lg:px-10">
                New
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader className="space-y-6">
                <DialogTitle>New Category</DialogTitle>
                <CategoryForm type="NEW" />
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <CategoriesList
        categories={categories}
        totalCategories={totalCategories}
      />
    </div>
  );
};

export default page;

const categories = [
  {
    id: 1,
    name: "ادوبی ایلوستریتور",
    url: "ادوبی-ایلوستریتور",
    post: { count: 22 },
  },
];

"use client";

import {
  CategoryName,
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/actions/Category";
import DeleteButton from "@/components/DeleteButton";
import Error from "@/components/Error";
import Loader from "@/components/Loader";
import Success from "@/components/Success";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useError from "@/hooks/useError";
import useLoading from "@/hooks/useLoading";
import useSuccess from "@/hooks/useSuccess";
import { categoryFormSchema, CategoryFormType } from "@/lib/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

interface Props {
  type: "NEW" | "UPDATE";
  category?: {
    id: number;
    name: string;
    url: string;
  };
  categoryName: CategoryName;
}

const CategoryForm = ({ type, category, categoryName }: Props) => {
  // HOOKS
  const router = useRouter();
  const { error, setError } = useError();
  const { loading, setLoading } = useLoading();
  const { success, setSuccess } = useSuccess();

  const isUpdateType = type === "UPDATE";

  const form = useForm<CategoryFormType>({
    resolver: zodResolver(categoryFormSchema),
    mode: "onSubmit",
    defaultValues: {
      name: category?.name || "",
      url: category?.url || "",
    },
  });

  const onSubmit = async (data: CategoryFormType) => {
    setError("");
    setSuccess("");
    setLoading(true);

    let res;
    if (type === "NEW") {
      res = await createCategory(data, categoryName);
    } else {
      res = await updateCategory(data, category?.id!, categoryName);
    }

    if (res.error) {
      setError(res.error);
      setLoading(false);
      return;
    }

    if (res.success) {
      setSuccess(res.success);
      setLoading(false);
      if (type === "NEW") form.reset();
      router.refresh();
    }
  };

  const onDelete = async () => {
    setError("");
    setSuccess("");

    const res = await deleteCategory(category?.id!, categoryName);

    if (res.error) {
      setError(res.error);
      return;
    }

    router.refresh();
  };

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Url</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          disabled={!form.formState.isValid || loading}
          className="w-full flex gap-2"
          type="submit"
        >
          {<Loader loading={loading} />}
          {isUpdateType ? "Update" : "Create"}
        </Button>

        {isUpdateType && <DeleteButton onDelete={onDelete} />}
        <Error error={error} />
        <Success success={success} />
      </form>
    </Form>
  );
};

export default CategoryForm;

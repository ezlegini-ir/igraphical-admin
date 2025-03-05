"use client";

import { createUser, deleteUser, updateUser } from "@/actions/user";
import { UserType } from "@/app/(DASHBOARD)/students/StudentsList";
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
import useImagePreview from "@/hooks/useImagePreview";
import useLoading from "@/hooks/useLoading";
import useSuccess from "@/hooks/useSuccess";
import { StudentFormType, studentFormSchema } from "@/lib/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import AvatarField from "../AvatarField";

interface Props {
  user?: UserType;
  type: "NEW" | "UPDATE";
}

const StudentForm = ({ type, user }: Props) => {
  // HOOKS
  const router = useRouter();
  const { error, setError } = useError();
  const { loading, setLoading } = useLoading();
  const { success, setSuccess } = useSuccess();
  const { imagePreview, setImagePreview } = useImagePreview(user?.image?.url);

  const isUpdateType = type === "UPDATE";

  const form = useForm<StudentFormType>({
    resolver: zodResolver(studentFormSchema),
    mode: "onSubmit",
    defaultValues: {
      email: user?.email || "",
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      nationalId: user?.nationalId || "",
      phone: user?.phone || "09",
    },
  });

  const onSubmit = async (data: StudentFormType) => {
    setError("");
    setLoading(true);

    let res;
    if (isUpdateType) {
      res = await updateUser(data, user?.id!);
    } else {
      res = await createUser(data);
    }

    if (res.error) {
      setError(res.error);
      setLoading(false);
      return;
    }
    if (res.success) {
      setSuccess(res.success);
      router.refresh();
      router.refresh();
      setLoading(false);
      form.reset();
    }
  };

  const onDelete = async (id: number | string) => {
    setError("");
    setSuccess("");
    setLoading(true);

    const res = await deleteUser(user?.id!);

    if (res.error) {
      setError(res.error);
      setLoading(false);
    }

    router.refresh();
  };

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <AvatarField
          control={form.control}
          imagePreview={imagePreview}
          setImagePreview={setImagePreview}
          public_id={user?.image?.public_id}
          setValue={form.setValue}
        />

        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input maxLength={11} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nationalId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>National Id</FormLabel>
              <FormControl>
                <Input maxLength={10} {...field} />
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

        {isUpdateType && <DeleteButton id={user?.id!} onDelete={onDelete} />}
        <Error error={error} />
        <Success success={success} />
      </form>
    </Form>
  );
};

export default StudentForm;

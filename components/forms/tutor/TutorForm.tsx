"use client";

import DeleteButton from "@/components/DeleteButton";
import Error from "@/components/Error";
import Loader from "@/components/Loader";
import Success from "@/components/Success";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useError from "@/hooks/useError";
import useLoading from "@/hooks/useLoading";
import useSuccess from "@/hooks/useSuccess";
import { TutorFormType, tutorFormSchema } from "@/lib/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { createTutor, deleteTutor, updateTutor } from "@/actions/tutor";
import { Tutor } from "@prisma/client";

interface Props {
  tutor?: Tutor;
  type: "NEW" | "UPDATE";
}

const TutorForm = ({ type, tutor: admin }: Props) => {
  // HOOKS
  const router = useRouter();
  const { error, setError } = useError();
  const { loading, setLoading } = useLoading();
  const { success, setSuccess } = useSuccess();

  const isUpdateType = type === "UPDATE";

  const form = useForm<TutorFormType>({
    resolver: zodResolver(tutorFormSchema),
    mode: "onSubmit",
    defaultValues: {
      name: admin?.name || "",
      displayName: admin?.displayName || "",
      password: "",
      email: admin?.email || "",
      phone: admin?.phone || "",
    },
  });

  const onSubmit = async (data: TutorFormType) => {
    setError("");
    setLoading(true);

    let res;
    if (isUpdateType) {
      res = await updateTutor({ ...data, id: admin?.id! });
    } else {
      res = await createTutor(data);
    }

    if (res.error) {
      setError(res.error);
      setLoading(false);
      return;
    }
    if (res.success) {
      setSuccess(res.success);
      router.refresh();
      setLoading(false);
      form.reset();
    }
  };

  const onDelete = async (id: number | string) => {
    setError("");
    setSuccess("");
    setLoading(true);

    const res = await deleteTutor(id as string);

    if (res.error) {
      setError(res.error);
      setLoading(false);
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
          name="displayName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display Name</FormLabel>
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
                <Input className="en-digits" {...field} />
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
                <Input maxLength={11} className="en-digits" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {isUpdateType ? "New Password" : "Password"}{" "}
              </FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              {isUpdateType && (
                <FormDescription className="text-xs">
                  Leave Empty if you don't want to change password
                </FormDescription>
              )}
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

        {isUpdateType && <DeleteButton id={admin?.id!} onDelete={onDelete} />}
        <Error error={error} />
        <Success success={success} />
      </form>
    </Form>
  );
};

export default TutorForm;

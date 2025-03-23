"use client";

import { createTutor, deleteTutor, updateTutor } from "@/actions/tutor";
import { TutorType } from "@/app/(DASHBOARD)/tutors/TutorsList";
import DeleteButton from "@/components/DeleteButton";
import Loader from "@/components/Loader";
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
import { Textarea } from "@/components/ui/textarea";
import useImagePreview from "@/hooks/useImagePreview";
import useLoading from "@/hooks/useLoading";
import { TutorFormType, tutorFormSchema } from "@/lib/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import AvatarField from "../AvatarField";

interface Props {
  tutor?: TutorType;
  type: "NEW" | "UPDATE";
}

const TutorForm = ({ type, tutor }: Props) => {
  // HOOKS
  const router = useRouter();
  const { loading, setLoading } = useLoading();
  const { imagePreview, setImagePreview } = useImagePreview(tutor?.image?.url);

  const isUpdateType = type === "UPDATE";

  const form = useForm<TutorFormType>({
    resolver: zodResolver(tutorFormSchema),
    mode: "onSubmit",
    defaultValues: {
      name: tutor?.name || "",
      displayName: tutor?.displayName || "",
      password: "",
      email: tutor?.email || "",
      phone: tutor?.phone || "",
      slug: tutor?.slug || "",
      bio: tutor?.bio || "",
      titles: tutor?.titles || "",
    },
  });

  const onSubmit = async (data: TutorFormType) => {
    setLoading(true);

    let res;
    if (isUpdateType) {
      res = await updateTutor({ ...data, id: tutor?.id! });
    } else {
      res = await createTutor(data);
    }

    if (res.error) {
      toast.error(res.error);
      setLoading(false);
      return;
    }

    if (res.success) {
      toast.success(res.success);
      router.refresh();
      setLoading(false);
      form.reset();
    }
  };

  const onDelete = async () => {
    setLoading(true);

    const res = await deleteTutor(tutor?.id!);

    if (res.error) {
      toast.error(res.error);
      setLoading(false);
    }

    if (res.success) {
      toast.success(res.success);
      router.refresh();
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <AvatarField
          control={form.control}
          setImagePreview={setImagePreview}
          setValue={form.setValue}
          imagePreview={imagePreview}
          public_id={tutor?.image?.public_id}
        />

        <div className="flex gap-3">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
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
              <FormItem className="w-full">
                <FormLabel>Display Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea dir="rtl" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="titles"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titles</FormLabel>
              <FormControl>
                <Textarea dir="rtl" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-3">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
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
              <FormItem className="w-full">
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input maxLength={11} className="en-digits" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
          disabled={
            !form.formState.isValid || loading || !form.formState.isDirty
          }
          className="w-full flex gap-2"
          type="submit"
        >
          {<Loader loading={loading} />}
          {isUpdateType ? "Update" : "Create"}
        </Button>

        {isUpdateType && <DeleteButton onDelete={onDelete} />}
      </form>
    </Form>
  );
};

export default TutorForm;

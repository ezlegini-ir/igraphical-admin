"use client";

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
import { Switch } from "@/components/ui/switch";
import useError from "@/hooks/useError";
import useLoading from "@/hooks/useLoading";
import useSuccess from "@/hooks/useSuccess";
import { notifbarFormSchema, NotifbarFormType } from "@/lib/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface Props {
  notifBar?: {
    content: string;
    link: string;
    active: boolean;
    bgColor: string;
    textColor: string;
  };
}

const NotifBarForm = ({ notifBar }: Props) => {
  const { error, setError } = useError();
  const { loading, setLoading } = useLoading();
  const { success, setSuccess } = useSuccess();

  const form = useForm<NotifbarFormType>({
    resolver: zodResolver(notifbarFormSchema),
    mode: "onSubmit",
    defaultValues: {
      content: notifBar?.content || "",
      link: notifBar?.link || "",
      active: notifBar?.active || false,
      bgColor: notifBar?.bgColor || "#3b82f6",
      textColor: notifBar?.textColor || "#ffffff",
    },
  });

  const onSubmit = async (data: NotifbarFormType) => {
    setError("");
    setLoading(true);

    console.log(data);

    setLoading(false);
    setSuccess("Notif Bar saved successfully!");
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <h3>Notification Bar</h3>

          <div className="card">
            <div className="space-y-3">
              <FormField
                control={form.control}
                name={"active"}
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-3">
                      <FormLabel>Active</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Input
                        dir="rtl"
                        className="text-left"
                        placeholder="Enter content"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter link" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-3">
                <FormField
                  control={form.control}
                  name="bgColor"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Backgound Color</FormLabel>
                      <FormControl>
                        <Input placeholder="#..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="textColor"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Text Color</FormLabel>
                      <FormControl>
                        <Input placeholder="#..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end">
                <Button
                  size={"sm"}
                  className="px-10"
                  type="submit"
                  disabled={loading}
                >
                  <Loader loading={loading} />
                  Save
                </Button>
              </div>
            </div>
          </div>

          <Error error={error} />
          <Success success={success} />
        </form>
      </Form>
    </div>
  );
};

export default NotifBarForm;

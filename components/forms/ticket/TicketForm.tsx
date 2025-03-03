"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useError from "@/hooks/useError";
import useLoading from "@/hooks/useLoading";
import useSuccess from "@/hooks/useSuccess";
import {
  StudentFormType,
  TicketFormSchema,
  ticketDepartment,
  ticketStatus,
} from "@/lib/validationSchema";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Download, Link as LinkIcon, Send } from "lucide-react";
import useFileName from "@/hooks/useFileName";
import CardBox from "@/components/CardBox";
import DeleteButton from "@/components/DeleteButton";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { avatar, igraphLogoCard } from "@/public";
import Link from "next/link";

type TicketCommentType = {
  id: number;
  ticketId: 1;
  type: "ADMIN" | "STUDENT";
  user: {
    id: number;
    name: string;
  };
  message: string;
  createdAt: Date;
  attachment?: {
    id: number;
    fileUrl: string;
  };
};

export type TicketType = {
  id: number;
  subject: string;
  status: "PENDING" | "CLOSED" | "ANSWERED";
  createdAt: Date;
  updatedAt: Date;
  department: "TECHNICAL" | "FINANCE" | "COURSE" | "SUGGEST";
  user: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
  comments: TicketCommentType[];
};

interface Props {
  type: "NEW" | "UPDATE";
  ticket?: TicketType;
}

const TicketForm = ({ type, ticket }: Props) => {
  // HOOKS
  const router = useRouter();
  const { error, setError } = useError();
  const { loading, setLoading } = useLoading();
  const { success, setSuccess } = useSuccess();
  const { fileName, setFileName } = useFileName();

  const isUpdateType = type === "UPDATE";

  const form = useForm<StudentFormType>({
    resolver: zodResolver(TicketFormSchema),
    mode: "onSubmit",
    defaultValues: {
      subject: ticket?.subject,
      file: undefined,
      message: `
      با سلام و وقت بخیر،
      کاربر محترم آی‌گرافیکال:

      `,
      status: ticket?.status || "ANSWERED",
      user: ticket?.user.id.toString() || "",
      department: ticket?.department || "COURSE",
    },
  });

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: any
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      field.onChange(file);
      setFileName(file.name);
    }
  };

  const onSubmit = async (data: StudentFormType) => {
    setError("");
    setLoading(true);

    console.log(data);

    form.reset();
    router.refresh();
    setSuccess("Created Successfully");
    setLoading(false);
  };

  const onDelete = (id: string | number) => {
    console.log("Deleted" + id);
  };

  return (
    <Form {...form}>
      <form
        className="grid grid-cols-12 gap-5 "
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="col-span-12 lg:col-span-8 xl:col-span-9 h-min space-y-3">
          <CardBox title="Send a new message">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea dir="rtl" className="min-h-[170px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between items-center">
              <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      htmlFor="file-upload"
                      className="cursor-pointer flex items-center gap-2"
                    >
                      <div className="card p-2">
                        <LinkIcon
                          size={18}
                          className="text-gray-400 hover:text-blue-500"
                        />
                      </div>
                      {fileName && (
                        <span className="text-sm text-gray-600">
                          {fileName}
                        </span>
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, field)}
                        id="file-upload"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="button">
                <Send />
                Send
              </Button>
            </div>

            <Separator />

            {isUpdateType && (
              <div className="py-3 space-y-3" dir="rtl">
                {ticket?.comments.map((comment, index) => (
                  <div key={index} className="space-y-3 text-sm">
                    <div
                      className={`card flex justify-between gap-5 items-end py-2 ${
                        comment.type === "ADMIN" && "bg-slate-100"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <Image
                            alt=""
                            src={
                              comment.type === "ADMIN" ? igraphLogoCard : avatar
                            }
                            width={40}
                            height={40}
                          />
                          <div>
                            <p>{comment.user.name}</p>
                            <span className="text-xs text-gray-500">
                              {comment.createdAt.toLocaleString("en-US")}
                            </span>
                          </div>
                        </div>
                        <p>{comment.message}</p>
                      </div>

                      {comment.attachment && (
                        <div>
                          <Link href={comment.attachment.fileUrl}>
                            <Button
                              size={"icon"}
                              className="h-8 w-8"
                              type="button"
                            >
                              <Download />
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBox>
        </div>

        <CardBox
          title="Summery"
          className="col-span-12 lg:col-span-4 xl:col-span-3 h-min order-first lg:order-last"
        >
          {isUpdateType && (
            <div className="space-y-3">
              <div className="flex justify-between text-gray-500 text-xs">
                <p className="flex flex-col">
                  <span>Created At</span>
                  <span className="text-sm">{new Date().toLocaleString()}</span>
                </p>
                <div>
                  <Separator orientation="vertical" />
                </div>
                <p className="flex flex-col">
                  <span>Last Update</span>
                  <span className="text-sm">{new Date().toLocaleString()}</span>
                </p>
              </div>

              <Separator />

              <ul className="text-xs text-gray-500">
                <li className="flex justify-between">
                  <span>User</span>
                  <span>{ticket?.user.name}</span>
                </li>
                <li className="flex justify-between">
                  <span>Email</span>
                  <span>{ticket?.user.email}</span>
                </li>
                <li className="flex justify-between">
                  <span>Phone</span>
                  <span>{ticket?.user.phone}</span>
                </li>
              </ul>

              <Separator />
            </div>
          )}
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a verified email to display" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ticketStatus.map((status, index) => (
                      <SelectItem key={index} value={status}>
                        <span
                          className={`capitalize font-medium ${
                            status === "ANSWERED"
                              ? "text-green-600"
                              : status === "PENDING"
                              ? "text-yellow-500"
                              : "text-red-500"
                          }`}
                        >
                          {status.toLowerCase()}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {!isUpdateType && (
            <FormField
              control={form.control}
              name="user"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a user...." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={"1"}>علیرضا ازلگینی</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a user...." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ticketDepartment.map((department, index) => (
                      <SelectItem
                        key={index}
                        className="capitalize"
                        value={department}
                      >
                        {department.toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            disabled={
              !form.formState.isValid || !form.formState.isDirty || loading
            }
            className="w-full flex gap-2"
            type="submit"
          >
            {<Loader loading={loading} />}
            {isUpdateType ? "Update" : "Create"}
          </Button>

          {isUpdateType && (
            <DeleteButton id={ticket?.id!} onDelete={onDelete} />
          )}

          <Error error={error} />
          <Success success={success} />
        </CardBox>
      </form>
    </Form>
  );
};

export default TicketForm;

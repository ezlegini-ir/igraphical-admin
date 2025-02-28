"use client";

import CardBox from "@/components/CardBox";
import DeleteButton from "@/components/DeleteButton";
import Error from "@/components/Error";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import useError from "@/hooks/useError";
import useImagePreview from "@/hooks/useImagePreview";
import useLoading from "@/hooks/useLoading";
import { PostFormType, postFormSchema } from "@/lib/validationSchema";
import { placeHolder } from "@/public";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

interface Props {
  type: "NEW" | "UPDATE";
  post?: {
    title: string;
    url: string;
    content: string;
    categories: { id: number }[];
    image: { url: string };
    author: { id: number };
    status: "0" | "1";
  };
}

const PostForm = ({ type, post }: Props) => {
  // HOOKS
  const router = useRouter();
  const { error, setError } = useError();
  const { loading, setLoading } = useLoading();
  const { imagePreview, setImagePreview } = useImagePreview(post?.image.url);

  // CONSTS
  const isUpdateType = type === "UPDATE";

  const form = useForm<PostFormType>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: post?.title,
      url: post?.url,
      content: post?.content,
      status: post?.status || "0",
      categories:
        post?.categories.map((category) => category.id.toString()) || [],
      image: undefined,
      author: post?.author.id.toString(),
    },
  });

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: any
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      field.onChange(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: PostFormType) => {
    setError("");
    setLoading(true);

    console.log(data);
  };

  const onDelete = (id: number | string) => {
    console.log(`post ${id} Deleted`);
  };

  return (
    <Form {...form}>
      <form
        className="grid grid-cols-12 gap-5"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="col-span-12 md:col-span-9 space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
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
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Textarea {...field} className="min-h-[400px]" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="col-span-12 md:col-span-3 space-y-4 order-first md:order-last">
          <CardBox title="Actions">
            <Button
              disabled={
                !form.formState.isValid || loading || !form.formState.isDirty
              }
              className="w-full flex gap-2"
              type="submit"
            >
              {<Loader loading={loading} />}
              {type === "NEW" ? "Create" : "Update"}
            </Button>
            {isUpdateType && (
              <div className="space-y-5">
                <DeleteButton id={3} onDelete={onDelete} />

                <Separator />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="0">⬜ Draft</SelectItem>
                            <SelectItem value="1">🟩 Published</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <div className="flex justify-between text-gray-500 text-xs">
                  <p className="flex flex-col">
                    <span>Published At</span>
                    <span className="text-sm">
                      {new Date().toLocaleString()}
                    </span>
                  </p>

                  <div>
                    <Separator orientation="vertical" />
                  </div>

                  <p className="flex flex-col">
                    <span>Last Update</span>
                    <span className="text-sm">
                      {new Date().toLocaleString()}
                    </span>
                  </p>
                </div>
              </div>
            )}
          </CardBox>

          <CardBox title="Image">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>فایل (اختیاری)</FormLabel> */}
                  <FormLabel htmlFor="file-upload">
                    <Image
                      alt=""
                      src={imagePreview || placeHolder}
                      width={375}
                      height={375}
                      className="aspect-video rounded-md object-cover border-2 hover:border-slate-300 cursor-pointer"
                    />
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept=".webp"
                      className="hidden"
                      onChange={(e) => handleImageChange(e, field)}
                      id="file-upload"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardBox>

          <CardBox title="Categories">
            <FormField
              control={form.control}
              name="categories"
              render={() => (
                <FormItem>
                  {/* <div className="mb-4">
                    <FormLabel>Categories</FormLabel>
                  </div> */}
                  {categories.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="categories"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className="flex flex-row items-start gap-3 pb-1.5 "
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, item.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.id
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal cursor-pointer">
                              {item.label}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardBox>

          <CardBox title="Author">
            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  {/* <FormLabel>Notify me about...</FormLabel> */}
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      {authors.map((item, index) => (
                        <FormItem
                          key={index}
                          className="flex items-center space-x-3 space-y-0"
                        >
                          <FormControl>
                            <RadioGroupItem value={item.id.toString()} />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            {item.name}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardBox>
        </div>
        <Error error={error} />
      </form>
    </Form>
  );
};

export default PostForm;

const authors = [
  { name: "Alireza Ezlegini", id: 123 },
  { name: "Fateme Ahmadi", id: 124 },
  { name: "Mahdi Bahrami", id: 125 },
];
const categories = [
  {
    id: "1",
    label: "بسته بندی",
  },
  {
    id: "2",
    label: "ایلوستریتور",
  },
  {
    id: "3",
    label: "گرافیک",
  },
  {
    id: "4",
    label: "سه بعدی",
  },
  {
    id: "5",
    label: "بلندر",
  },
  {
    id: "6",
    label: "فتوشاپ",
  },
] as const;

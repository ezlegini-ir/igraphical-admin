"use client";

import { createPost, deletePost, updatePost } from "@/actions/post";
import { PostType } from "@/app/(DASHBOARD)/posts/list/PostsList";
import CardBox from "@/components/CardBox";
import DeleteButton from "@/components/DeleteButton";
import Error from "@/components/Error";
import TextEditor from "@/components/LexicalEditor/TextEditor";
import Loader from "@/components/Loader";
import Success from "@/components/Success";
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
import useError from "@/hooks/useError";
import useImagePreview from "@/hooks/useImagePreview";
import useLoading from "@/hooks/useLoading";
import useSuccess from "@/hooks/useSuccess";
import { PostFormType, postFormSchema } from "@/lib/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Admin, PostCategory } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import ImageField from "../../ImageField";

interface Props {
  type: "NEW" | "UPDATE";
  post?: PostType;
  categories: PostCategory[];
  authors: Admin[];
}

const PostForm = ({ type, post, categories, authors }: Props) => {
  // HOOKS
  const router = useRouter();
  const { error, setError } = useError();
  const { loading, setLoading } = useLoading();
  const { imagePreview, setImagePreview } = useImagePreview(post?.image?.url);
  const { success, setSuccess } = useSuccess();

  // CONSTS
  const isUpdateType = type === "UPDATE";

  const form = useForm<PostFormType>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: post?.title || "",
      url: post?.url || "",
      content: post?.content || "",
      status: post?.status ? (post?.status === "DRAFT" ? "0" : "1") : "0",
      categories:
        post?.categories?.map((category) => category.id.toString()) || [],
      image: undefined,
      author: post?.author?.id?.toString() || "",
    },
  });

  const onSubmit = async (data: PostFormType) => {
    setError("");
    setLoading(true);

    if (isUpdateType) {
      const res = await updatePost(data, post?.id!);

      if (res.error) {
        setError(res.error);
        setLoading(false);
        return;
      }

      if (res.success) {
        setSuccess(res.success);
        setLoading(false);
        router.refresh();
      }
    } else {
      const res = await createPost(data);

      if (res.error) {
        setError(res.error);
        setLoading(false);
        return;
      }

      if (res.success) {
        router.push(`/posts/${res.data?.id}`);
      }
    }
  };

  const onDelete = async () => {
    setError("");
    setLoading(true);

    const res = await deletePost(post?.id!);

    if (res.error) {
      setError(res.error);
      setLoading(false);
    }

    if (res.success) {
      router.push("/posts/list");
    }
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

          <div>
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
            {isUpdateType && (
              <Link
                href={`${process.env.NEXT_PUBLIC_MAIN_URL}/blog/${post?.url}`}
                className="text-xs text-gray-500"
              >
                <p>
                  {process.env.NEXT_PUBLIC_MAIN_URL}/blog/{post?.url}
                </p>
              </Link>
            )}
          </div>

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="pb-10">
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <TextEditor onChange={field.onChange} value={field.value} />
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
            <Error error={error} />
            <Success success={success} />

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

            {isUpdateType && (
              <div className="space-y-5">
                <DeleteButton disabled={loading} onDelete={onDelete} />

                <Separator />

                <div className="flex justify-between text-gray-500 text-xs">
                  <p className="flex flex-col">
                    <span>Published At</span>
                    <span className="text-sm">
                      {post?.createdAt.toLocaleString()}
                    </span>
                  </p>

                  <div>
                    <Separator orientation="vertical" />
                  </div>

                  <p className="flex flex-col">
                    <span>Last Update</span>
                    <span className="text-sm">
                      {post?.updatedAt.toLocaleString()}
                    </span>
                  </p>
                </div>
              </div>
            )}
          </CardBox>

          <CardBox title="Image">
            <ImageField
              control={form.control}
              setImagePreview={setImagePreview}
              imagePreview={imagePreview}
              setValue={form.setValue}
              public_id={post?.image?.public_id}
            />
          </CardBox>

          <CardBox title="Categories">
            <FormField
              control={form.control}
              name="categories"
              render={({ field }) => (
                <FormItem>
                  {categories?.map((item) => {
                    const isChecked = field.value?.includes(item.id.toString());

                    return (
                      <FormItem
                        key={item.id}
                        className="flex flex-row items-start gap-3 pb-1.5"
                      >
                        <FormControl>
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={(checked) => {
                              const updatedCategories = checked
                                ? [...field.value, item.id.toString()]
                                : field.value.filter(
                                    (value) => value !== item.id.toString()
                                  );

                              field.onChange(updatedCategories);
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal cursor-pointer">
                          {item.name}
                        </FormLabel>
                      </FormItem>
                    );
                  })}
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
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      {authors?.map((item, index) => (
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
      </form>
    </Form>
  );
};

export default PostForm;

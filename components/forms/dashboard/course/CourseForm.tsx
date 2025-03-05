"use client";

import CardBox from "@/components/CardBox";
import DeleteButton from "@/components/DeleteButton";
import Error from "@/components/Error";
import CurriculumSectionsForm from "@/components/forms/dashboard/course/CurriculumSectionsForm";
import Loader from "@/components/Loader";
import Success from "@/components/Success";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import useError from "@/hooks/useError";
import useImagePreview from "@/hooks/useImagePreview";
import useLoading from "@/hooks/useLoading";
import useSuccess from "@/hooks/useSuccess";
import { cn } from "@/lib/utils";
import { CourseFormType, courseFormSchema } from "@/lib/validationSchema";
import { placeHolder } from "@/public";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays, format } from "date-fns";
import { CalendarIcon, Image as ImageIcon, Plus, Trash, X } from "lucide-react";
import Image from "next/image";
import * as React from "react";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

export type CourseProps = Omit<CourseFormType, "image" | "gallery"> & {
  image: { url: string };
  gallery: string[];
};

interface Props {
  type: "NEW" | "UPDATE";
  course?: CourseProps;
}

const CourseForm = ({ type, course }: Props) => {
  // HOOKS
  // const router = useRouter();
  const { error, setError } = useError();
  const { loading, setLoading } = useLoading();
  const { imagePreview, setImagePreview } = useImagePreview(course?.image.url);
  const [disocunt, setDiscount] = useState(!!course?.discount);
  const { success, setSuccess } = useSuccess();
  const [disocuntDate, setDiscountDate] = useState(!!course?.discount?.date);
  const [galleryPreviews, setGalleryPreviews] = useState<string[] | undefined>(
    course?.gallery
  );

  // CONSTS
  const isUpdateType = type === "UPDATE";

  const form = useForm<CourseFormType>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: course?.title || "",
      category: course?.category || "",
      description: course?.description || "",
      url: course?.url || "",
      duration: course?.duration || 0,
      image: undefined,
      instructor: course?.instructor || "",
      learns: course?.learns || [{ value: "" }],
      prerequisite: course?.prerequisite || [{ value: "" }],
      price: course?.price || 0,
      status: course?.status || "0",
      summery: course?.summery || "",
      tizerUrl: course?.tizerUrl || "",
      discount: {
        amount: course?.discount?.amount || 0,
        date: {
          from: course?.discount?.date?.from || new Date(),
          to: course?.discount?.date?.to || addDays(new Date(), 4),
        },
        type: course?.discount?.type,
      },
      curriculum: course?.curriculum?.length
        ? course.curriculum.map((section) => ({
            sectionTitle: section.sectionTitle || "",
            lessons: section.lessons?.length
              ? section.lessons.map((lesson) => ({
                  title: lesson.title || "",
                  duration: lesson.duration || 0,
                  url: lesson.url || "",
                  isFree: lesson.isFree || false,
                  type: lesson.type || "VIDEO",
                }))
              : [
                  {
                    title: "",
                    duration: 0,
                    url: "",
                    isFree: false,
                    type: "VIDEO",
                  },
                ],
          }))
        : [
            {
              sectionTitle: "",
              lessons: [
                {
                  title: "",
                  duration: 0,
                  url: "",
                  isFree: false,
                  type: "VIDEO",
                },
              ],
            },
          ],
    },
  });

  // 🧮 Prerequisites Field Array
  const {
    fields: prerequisiteFields,
    append: appendPrerequisite,
    remove: removePrerequisite,
  } = useFieldArray({
    name: "prerequisite",
    control: form.control,
  });

  // 🧮 Course Includes Field Array
  const {
    fields: courseIncludesFields,
    append: appendCourseInclude,
    remove: removeCourseInclude,
  } = useFieldArray({
    name: "learns",
    control: form.control,
  });

  // 🧮 Curriculums Field Array
  const {
    fields: sectionFields,
    append: appendSection,
    remove: removeSection,
  } = useFieldArray({
    name: "curriculum",
    control: form.control,
  });

  const handleGalleryRemove = (imageUrl: string) => {
    setGalleryPreviews((prev) => prev?.filter((img) => img !== imageUrl));

    form.setValue(
      "gallery",
      form
        .getValues("gallery")
        ?.filter((file) => URL.createObjectURL(file) !== imageUrl)
    );

    //TODO: Remove From Cloud
    console.log("deleted", imageUrl);
  };

  const handleGalleryPreview = (files: File[]) => {
    const imageUrls = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );
    setGalleryPreviews(imageUrls);
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: any
  ) => {
    const input = e.target;

    if (input.files?.length) {
      const file = input.files[0];

      field.onChange(file);
      setImagePreview(URL.createObjectURL(file));

      input.value = "";
    }
  };

  const handleImageRemove = () => {
    setImagePreview(undefined);
    form.setValue("image", undefined);

    //TODO: Remove From Cloud
    console.log("deleted");
  };

  const onSubmit = async (data: CourseFormType) => {
    setError("");
    setSuccess("");
    setLoading(true);

    console.log(data);
  };

  const onDelete = (id: number | string) => {
    console.log(`post ${id} Deleted`);
  };

  return (
    <>
      <Form {...form}>
        <form
          className="grid grid-cols-12 gap-5"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="col-span-12 md:col-span-9 space-y-4">
            {/* //! TITLE */}
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

            {/* //! URL */}
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

            {/* //! SUMMERY */}
            <FormField
              control={form.control}
              name="summery"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Summery</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="min-h-[100px]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* //! DESCRIPTION */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="min-h-[400px]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* //! PREREQUISITE */}
            <div className="bg-white p-4 py-6 rounded-sm border grid gap-3 grid-cols-2">
              <div>
                <FormItem>
                  <FormLabel>Prerequisites</FormLabel>
                  <div className="space-y-2">
                    {prerequisiteFields.map((field, index) => (
                      <FormField
                        key={field.id}
                        control={form.control}
                        name={`prerequisite.${index}.value`}
                        render={({ field }) => (
                          <FormItem className="flex gap-1 items-center">
                            <FormControl>
                              <Input
                                placeholder={`Prerequisite ${index + 1}`}
                                {...field}
                              />
                            </FormControl>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removePrerequisite(index)}
                            >
                              <Trash className="text-gray-400" size={16} />
                            </Button>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
                <Button
                  type="button"
                  onClick={() => appendPrerequisite({ value: "" })}
                  variant="secondary"
                  className="flex items-center gap-2 w-full mt-3"
                >
                  <Plus size={16} />
                  Add Prerequisite
                </Button>
              </div>

              {/* //! LEARNS */}
              <div>
                <FormItem>
                  <FormLabel>Learns</FormLabel>
                  <div className="space-y-2">
                    {courseIncludesFields.map((field, index) => (
                      <FormField
                        key={field.id}
                        control={form.control}
                        name={`learns.${index}.value`}
                        render={({ field }) => (
                          <FormItem className="flex gap-1 items-center">
                            <FormControl>
                              <Input
                                placeholder={`Course Include ${index + 1}`}
                                {...field}
                              />
                            </FormControl>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeCourseInclude(index)}
                            >
                              <Trash className="text-gray-400" size={16} />
                            </Button>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
                <Button
                  type="button"
                  onClick={() => appendCourseInclude({ value: "" })}
                  variant="secondary"
                  className="flex items-center gap-2 w-full mt-3"
                >
                  <Plus size={16} />
                  Add Learns
                </Button>
              </div>
            </div>

            <div className="py-6">
              <Separator />
            </div>

            {/* //! CURRICULUMS */}
            <FormLabel>Curriculums</FormLabel>
            <div className="card">
              {sectionFields.map((section, sectionIndex) => (
                <CurriculumSectionsForm
                  key={section.id}
                  sectionIndex={sectionIndex}
                  control={form.control}
                  removeSection={removeSection}
                />
              ))}

              <Button
                type="button"
                variant={"secondary"}
                onClick={() =>
                  appendSection({
                    sectionTitle: "",
                    lessons: [
                      {
                        title: "",
                        duration: undefined,
                        url: "",
                        isFree: false,
                        type: "VIDEO",
                      },
                    ],
                  })
                }
              >
                <Plus />
                Add Section
              </Button>
            </div>
          </div>

          <div className="col-span-12 md:col-span-3 space-y-4 order-first md:order-last">
            <CardBox title="Actions">
              <Button
                // disabled={
                //   !form.formState.isValid || loading || !form.formState.isDirty
                // }
                className="w-full flex gap-2"
                type="submit"
              >
                {<Loader loading={loading} />}
                {type === "NEW" ? "Create" : "Update"}
              </Button>

              <Error error={error} />
              <Success success={success} />

              <div className="space-y-5">
                {isUpdateType && <DeleteButton id={3} onDelete={onDelete} />}

                <Separator />

                {/* //! STATUS */}
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

                {isUpdateType && (
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
                )}
              </div>
            </CardBox>

            {/* //! PRICE */}
            <CardBox title="Price">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Base Price {"(T)"}</FormLabel>
                    <FormControl>
                      <Input
                        min={0}
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* //! DISCOUNT */}
              <div className="flex items-center space-x-2 py-3">
                <Switch
                  id="disocunt"
                  onCheckedChange={setDiscount}
                  defaultChecked={!!course?.discount}
                />
                <Label htmlFor="disocunt" className="cursor-pointer">
                  Apply Discount
                </Label>
              </div>

              {disocunt && (
                <CardBox title="Discount">
                  <FormField
                    control={form.control}
                    name="discount.amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                          <Input
                            min={0}
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(e.target.valueAsNumber)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="discount.type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Percent Type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="FIXED">Fixed</SelectItem>
                            <SelectItem value="PERCENT">Percent</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center space-x-2 py-3">
                    <Switch
                      id="disocunt"
                      onCheckedChange={setDiscountDate}
                      defaultChecked={!!course?.discount?.date}
                    />
                    <Label htmlFor="disocunt" className="cursor-pointer">
                      From / To
                    </Label>
                  </div>

                  {disocuntDate && (
                    <div>
                      <FormField
                        control={form.control}
                        name="discount.date"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Date of birth</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      <div className="flex gap-1">
                                        {format(field.value.from, "MMMM dd")}{" "}
                                        {/* Formatted 'from' date */}
                                        <span>-</span>
                                        {format(field.value.to, "MMMM dd")}{" "}
                                        {/* Formatted 'to' date */}
                                      </div>
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0 en-digits"
                                align="start"
                              >
                                <Calendar
                                  mode="range"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) => date < new Date()}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </CardBox>
              )}
            </CardBox>

            {/* //! IMAGE */}
            <CardBox title="Image">
              <div className="relative group">
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
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

                {(course?.image || imagePreview) && (
                  <Button
                    type="button"
                    onClick={() => handleImageRemove()}
                    variant={"secondary"}
                    className="absolute top-0 left-0 m-1 hidden group-hover:flex bg-black/40 hover:bg-black/50 text-white"
                    size={"sm"}
                  >
                    <X />
                    Remove
                  </Button>
                )}
              </div>
            </CardBox>

            {/* //! CATEGORY */}
            <CardBox title="Category">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        {categories.map((category, index) => (
                          <FormItem
                            key={index}
                            className="flex items-center space-x-3 space-y-0"
                          >
                            <FormControl>
                              <RadioGroupItem value={category.id.toString()} />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              {category.name}
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

            {/* //! INSTRUCTOR */}
            <FormField
              control={form.control}
              name="instructor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instructor</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an Instructor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="alireza-ezlegini">
                        Alireza Ezlegini
                      </SelectItem>
                      <SelectItem value="fateme-ahmadi">
                        Fateme Ahmadi
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* //! TIZER URL */}
            <FormField
              control={form.control}
              name="tizerUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tizer Url</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* //! DURATION */}
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (min)</FormLabel>
                  <FormControl>
                    <Input
                      min={0}
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* //! Gallery */}
            <CardBox title="Gallery">
              <FormField
                control={form.control}
                name="gallery"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="gallery">
                      <div className="flex gap-2 justify-center items-center bg-secondary  p-3 rounded-sm w-full cursor-pointer hover:bg-neutral-200/60">
                        <ImageIcon size={18} />
                        Add Image
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        id="gallery"
                        className="hidden"
                        multiple
                        onChange={(e) => {
                          if (e.target.files) {
                            const filesArray = Array.from(e.target.files); // ✅ Convert FileList to array
                            field.onChange(filesArray); // Pass array to React Hook Form
                            handleGalleryPreview(filesArray);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {galleryPreviews && galleryPreviews.length > 0 && (
                <div className="grid grid-cols-4 gap-1">
                  {galleryPreviews.map((image, index) => (
                    <div className="relative group" key={index}>
                      <Image
                        alt={`Preview ${index}`}
                        src={image}
                        className="aspect-square object-cover rounded-sm"
                        width={200}
                        height={200}
                      />
                      <Button
                        type="button"
                        onClick={() => handleGalleryRemove(image)}
                        className="h-4 w-4 absolute top-0 left-0 m-1 hidden group-hover:block"
                        size={"icon"}
                        variant={"secondary"}
                      >
                        <X />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardBox>
          </div>
        </form>
      </Form>
    </>
  );
};

export default CourseForm;

const categories = [
  {
    id: "1",
    name: "بسته بندی",
  },
  {
    id: "2",
    name: "ایلوستریتور",
  },
] as const;

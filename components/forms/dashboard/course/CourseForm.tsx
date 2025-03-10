"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { createCourse, deleteCourse, updateCourse } from "@/actions/course";
import { deleteImage } from "@/actions/image";
import Avatar from "@/components/Avatar";
import CardBox from "@/components/CardBox";
import ComboField from "@/components/ComboField";
import DeleteButton from "@/components/DeleteButton";
import Error from "@/components/Error";
import CurriculumSectionsForm from "@/components/forms/dashboard/course/CurriculumSectionsForm";
import Loader from "@/components/Loader";
import Success from "@/components/Success";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import useError from "@/hooks/useError";
import useImagePreview from "@/hooks/useImagePreview";
import useLoading from "@/hooks/useLoading";
import useSuccess from "@/hooks/useSuccess";
import { CourseFormType, courseFormSchema } from "@/lib/validationSchema";
import {
  Course,
  CourseCategory,
  Curriculum,
  Discount,
  GalleryItem,
  Image as ImageType,
  Learn,
  Lesson,
  Prerequisite,
  Tutor,
} from "@prisma/client";
import { addDays, format } from "date-fns";
import { BadgePercent, CalendarIcon, Plus, Trash, X } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFieldArray } from "react-hook-form";
import ImageField from "../../ImageField";
import { Badge } from "@/components/ui/badge";
import { DateRange } from "react-day-picker";
import Link from "next/link";

const TextEditor = dynamic(
  () => import("@/components/LexicalEditor/TextEditor"),
  {
    ssr: false,
    loading: () => (
      <Skeleton className="w-full h-[450px] bg-white border rounded-sm" />
    ),
  }
);

interface TutorType extends Tutor {
  image: ImageType | null;
}

export interface CourseType extends Course {
  tutor: Tutor;
  image: ImageType | null;
  learn: Learn[];
  prerequisite: Prerequisite[];
  discount: Discount | null;
  curriculum: (Curriculum & { lessons: Lesson[] })[];
  gallery: (GalleryItem & { image: ImageType[] }) | null;
}

interface Props {
  type: "NEW" | "UPDATE";
  course?: CourseType | null;
  tutors: TutorType[];
  categories: CourseCategory[];
}

const CourseForm = ({ type, course, tutors, categories }: Props) => {
  // HOOKS
  const router = useRouter();
  const { error, setError } = useError();
  const { loading, setLoading } = useLoading();
  const { imagePreview, setImagePreview } = useImagePreview(course?.image?.url);
  const [discountEnabled, setDiscountEnabled] = useState(!!course?.discount);
  const { success, setSuccess } = useSuccess();
  const [disocuntDateEnabled, setDiscountDateEnabled] = useState(
    !!course?.discount?.from || !!course?.discount?.to
  );
  const [galleryPreviews, setGalleryPreviews] = useState<
    { public_id?: string; url: string }[] | undefined
  >();
  const { loading: removeImageLoading, setLoading: setRemoveImageLoading } =
    useLoading();

  // CONSTS
  const isUpdateType = type === "UPDATE";

  const form = useForm<CourseFormType>({
    resolver: zodResolver(courseFormSchema),
    mode: "onChange",
    defaultValues: {
      title: course?.title || "",
      categoryId: course?.categoryId?.toString() || "",
      description: course?.description || "",
      url: course?.url || "",
      duration: course?.duration || 0,
      image: undefined,
      needs: course?.needs || "",
      audience: course?.audience || "",
      jobMarket: course?.jobMarket || "",
      tutorId: course?.tutorId?.toString() || "",
      learns: course?.learn || [{ value: "" }],
      prerequisite: course?.prerequisite || [{ value: "" }],
      basePrice: course?.basePrice || 0,
      status: course?.status === "DRAFT" ? "0" : "1",
      summary: course?.summary || "",
      tizerUrl: course?.tizerUrl || "",
      discount: course?.discount
        ? {
            amount: course?.discount?.amount || 0,
            type: course?.discount?.type,
            date: disocuntDateEnabled
              ? {
                  from: course?.discount?.from || new Date(),
                  to: course?.discount?.to || addDays(new Date(), 4),
                }
              : {
                  from: new Date(),
                  to: addDays(new Date(), 4),
                },
          }
        : {
            amount: 0,
            type: "FIXED",
            date: {
              from: new Date(),
              to: addDays(new Date(), 4),
            },
          },
      curriculum: course?.curriculum?.length
        ? course.curriculum.map((section) => ({
            sectionTitle: section.sectionTitle || "",
            lessons: section.lessons?.length
              ? section.lessons.map((lesson) => ({
                  title: lesson.title,
                  duration: lesson.duration || 0,
                  url: lesson.url,
                  isFree: lesson.isFree,
                  type: lesson.type,
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

  const handleGalleryPreview = (files: File[]) => {
    const imageUrls = files.map((file) => ({
      url: URL.createObjectURL(file),
    }));

    setGalleryPreviews((prev = []) => [...prev, ...imageUrls]);
  };

  const handleGalleryPreviewRemove = async (index: number) => {
    setGalleryPreviews((prev) => prev?.filter((_, i) => i !== index));

    form.setValue(
      "gallery",
      form.getValues("gallery")?.filter((_, i) => i !== index) || []
    );
  };

  const handleGalleryRemove = async (publicId: string) => {
    setError("");
    setRemoveImageLoading(true);

    const res = await deleteImage(publicId);

    if (res.error) {
      setError(res.error);
      setRemoveImageLoading(false);
      return;
    }

    router.refresh();
    setRemoveImageLoading(false);
  };

  const onSubmit = async (data: CourseFormType) => {
    setError("");
    setSuccess("");
    setLoading(true);

    const res = isUpdateType
      ? await updateCourse(data, course?.id!)
      : await createCourse(data);

    if (res.error) {
      setError(res.error);
      setLoading(false);
      return;
    }

    if (res.success) {
      if (isUpdateType) {
        setLoading(false);
        setSuccess(res.success);
        setGalleryPreviews([]);
        form.setValue("gallery", undefined);
        router.refresh();
      } else {
        router.push(`/courses/${res.course.id}`);
      }
    }
  };

  const onDelete = async () => {
    const res = await deleteCourse(course?.id!);

    if (res.error) {
      setError(res.error);
      return;
    }

    router.push("/courses/list");
  };

  const handleDiscountToggle = (checked: boolean) => {
    setDiscountEnabled(checked);
    if (!checked) {
      form.setValue("discount", undefined);
    }
  };

  const handleDiscountDateToggle = (checked: boolean) => {
    setDiscountDateEnabled(checked);

    if (!checked) {
      form.setValue("discount.date", undefined);
    }
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
                  href={`${process.env.NEXT_PUBLIC_MAIN_URL}/courses/${course?.url}`}
                  className="text-xs text-gray-500 flex w-fit"
                >
                  <p>
                    {process.env.NEXT_PUBLIC_MAIN_URL}/courses/{course?.url}
                  </p>
                </Link>
              )}
            </div>

            {/* //! DESCRIPTION */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <TextEditor onChange={field.onChange} value={field.value} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="py-5">
              <Separator />
            </div>

            <div className="grid gap-5 grid-cols-2">
              {/* //! SUMMERY */}
              <div className="col-span-2">
                <FormField
                  control={form.control}
                  name="summary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Summery</FormLabel>
                      <FormControl>
                        <Textarea
                          dir="rtl"
                          {...field}
                          className="min-h-[150px] leading-loose"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="audience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Audience</FormLabel>
                    <FormControl>
                      <Textarea
                        dir="rtl"
                        {...field}
                        className="min-h-[100px] leading-loose"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="needs"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Needs</FormLabel>
                    <FormControl>
                      <Textarea
                        dir="rtl"
                        {...field}
                        className="min-h-[100px] leading-loose"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="col-span-2">
                <FormField
                  control={form.control}
                  name="jobMarket"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Market</FormLabel>
                      <FormControl>
                        <Textarea
                          dir="rtl"
                          {...field}
                          className="min-h-[100px] leading-loose"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* //! PREREQUISITE */}
            <div className="grid gap-3 grid-cols-2">
              <div>
                <FormItem>
                  <FormLabel>Prerequisites</FormLabel>
                  <div className="space-y-2  card p-3">
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
                              disabled={
                                form.getValues("prerequisite")?.length === 1
                              }
                              onClick={() => removePrerequisite(index)}
                            >
                              <Trash className="text-gray-400" size={16} />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => appendPrerequisite({ value: "" })}
                            >
                              <Plus className="text-gray-400" size={16} />
                            </Button>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              </div>

              {/* //! LEARNS */}
              <div>
                <FormItem>
                  <FormLabel>Learns</FormLabel>
                  <div className="space-y-2 card p-3">
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
                              disabled={
                                form.getValues("prerequisite")?.length === 1
                              }
                              onClick={() => removeCourseInclude(index)}
                            >
                              <Trash className="text-gray-400" size={16} />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => appendCourseInclude({ value: "" })}
                            >
                              <Plus className="text-gray-400" size={16} />
                            </Button>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              </div>
            </div>

            <div className="py-6">
              <Separator />
            </div>

            {/* //! CURRICULUMS */}
            <div className="space-y-2">
              <FormLabel className="font-semibold text-base ">
                Curriculums
              </FormLabel>
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

              <div className="space-y-5">
                {isUpdateType && <DeleteButton onDelete={onDelete} />}

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
                        {course?.createdAt.toLocaleString()}
                      </span>
                    </p>

                    <div>
                      <Separator orientation="vertical" />
                    </div>

                    <p className="flex flex-col">
                      <span>Last Update</span>
                      <span className="text-sm">
                        {course?.updatedAt.toLocaleString()}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </CardBox>

            {/* //! PRICE */}
            <CardBox title="Price">
              {isUpdateType && (
                <>
                  <div className="flex justify-between text-sm items-center text-gray-500">
                    <p className="flex gap-1 items-center">
                      {course?.discount && (
                        <span className="text-primary font-medium">
                          <BadgePercent />
                        </span>
                      )}
                      Final Price
                    </p>
                    <span className="text-primary font-semibold">
                      {course?.price === 0 ? (
                        <Badge variant={"green"}>Free</Badge>
                      ) : (
                        course?.price.toLocaleString("en-US") + " T"
                      )}
                    </span>
                  </div>
                  <Separator />
                </>
              )}

              <FormField
                control={form.control}
                name="basePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Base Price (T)</FormLabel>
                    <FormControl>
                      <Input
                        min={0}
                        type="number"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === "" ? 0 : Number(value));
                        }}
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
                  onCheckedChange={handleDiscountToggle}
                  defaultChecked={discountEnabled}
                />
                <Label htmlFor="disocunt" className="cursor-pointer">
                  Apply Discount
                </Label>
              </div>

              {discountEnabled && (
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
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(value === "" ? 0 : Number(value));
                            }}
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
                            <SelectTrigger className="h-11">
                              <SelectValue placeholder="Discount Type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="FIXED">
                              <div className="flex items-center gap-1 font-medium">
                                <span className="text-xl pr-1 text-primary">
                                  $
                                </span>{" "}
                                Fixed
                              </div>
                            </SelectItem>
                            <SelectItem value="PERCENT">
                              <div className="flex items-center gap-1 font-medium">
                                <span className="text-xl pr-1 text-orange-500">
                                  %
                                </span>{" "}
                                Percent
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center space-x-2 py-3">
                    <Switch
                      id="disocunt-date"
                      onCheckedChange={handleDiscountDateToggle}
                      defaultChecked={disocuntDateEnabled}
                    />
                    <Label htmlFor="disocunt-date" className="cursor-pointer">
                      From / To
                    </Label>
                  </div>

                  {disocuntDateEnabled && (
                    <div>
                      <FormField
                        control={form.control}
                        name="discount.date"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            {/* <FormLabel>Date of birth</FormLabel> */}
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
                                        {format(
                                          field.value.from || new Date(),
                                          "MMMM dd"
                                        )}
                                        <span>-</span>
                                        {format(
                                          field.value.to ||
                                            addDays(new Date(), 4),
                                          "MMMM dd"
                                        )}{" "}
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
                                  selected={field.value as DateRange}
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
              <ImageField
                control={form.control}
                setImagePreview={setImagePreview}
                setValue={form.setValue}
                imagePreview={imagePreview}
                public_id={course?.image?.public_id}
              />
            </CardBox>

            {/* //! CATEGORY */}
            <CardBox title="Category">
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        {categories?.map((category, index) => (
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

            {/* //! TUTOR */}
            <FormField
              control={form.control}
              name="tutorId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="mb-1">Tutor</FormLabel>
                  <ComboField<TutorType>
                    options={tutors}
                    getLabel={(tutor) => (
                      <div className="flex items-center gap-2">
                        <Avatar src={tutor.image?.url} size={22} />
                        {tutor.name}
                      </div>
                    )}
                    getValue={(tutor) => tutor.id.toString()}
                    getSearchText={(tutor) => tutor.name}
                    onSelect={(tutor) => field.onChange(tutor.id.toString())}
                    placeholder="Select Tutor"
                    defaultValue={course?.tutorId?.toString() || ""}
                  />
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
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === "" ? 0 : Number(value));
                      }}
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
                        <Plus size={18} />
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
                            const newFilesArray = Array.from(e.target.files);
                            const allFiles = [
                              ...(field.value || []),
                              ...newFilesArray,
                            ];
                            field.onChange(allFiles);
                            // Pass only the newly selected files to avoid duplicating previews
                            handleGalleryPreview(newFilesArray);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {galleryPreviews && galleryPreviews?.length > 0 && (
                <div className="space-y-3">
                  <div className="grid grid-cols-4 gap-1">
                    {galleryPreviews?.map((image, index) => (
                      <div className="relative group" key={index}>
                        <Image
                          alt=""
                          src={image.url}
                          className="aspect-square object-cover rounded-sm"
                          width={100}
                          height={100}
                        />
                        <Button
                          type="button"
                          onClick={() => handleGalleryPreviewRemove(index)}
                          className="h-4 w-4 absolute top-0 left-0 m-1 hidden group-hover:block"
                          size={"icon"}
                          variant={"secondary"}
                        >
                          <X />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Separator />
                </div>
              )}

              <div className="grid grid-cols-4 gap-1">
                {course?.gallery?.image.map((image, index) => (
                  <div
                    className="relative group overflow-hidden rounded-sm"
                    key={index}
                  >
                    <Image
                      alt=""
                      src={image.url}
                      className="aspect-square object-cover rounded-sm"
                      width={100}
                      height={100}
                    />
                    <Button
                      type="button"
                      onClick={() => handleGalleryRemove(image.public_id!)}
                      className={`w-6 h-6 rounded-full absolute top-0 left-0 m-1 hidden group-hover:flex`}
                      size={"icon"}
                      variant={"destructive"}
                    >
                      <Loader loading={removeImageLoading} />

                      {!removeImageLoading && <X />}
                    </Button>
                  </div>
                ))}
                {/* 
                {removeImageLoading && (
                  <div className="bg-white/50 absolute w-full h-full top-0 left-0 flex justify-center items-center">
                    <Loader loading />
                  </div>
                )} */}
              </div>
            </CardBox>
          </div>
        </form>
      </Form>
    </>
  );
};

export default CourseForm;

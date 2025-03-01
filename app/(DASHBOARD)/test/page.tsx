"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

const galleryFormSchema = z.object({
  gallery: z
    .array(z.instanceof(File, { message: "Each item must be an image file" }))
    .nonempty("At least one image is required")
    .max(10, "You can upload up to 10 images"),
});

type GalleryFormType = z.infer<typeof galleryFormSchema>;

const GalleryForm = () => {
  const [previews, setPreviews] = useState<string[]>([]);

  const form = useForm<GalleryFormType>({
    resolver: zodResolver(galleryFormSchema),
    defaultValues: {
      gallery: [],
    },
  });

  const onSubmit = (data: GalleryFormType) => {
    console.log("Submitted Data:", data);
  };

  const handleImagePreview = (files: File[]) => {
    const imageUrls = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );
    setPreviews(imageUrls);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="gallery"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gallery Images</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    if (e.target.files) {
                      const filesArray = Array.from(e.target.files); // ✅ Convert FileList to array
                      field.onChange(filesArray); // Pass array to React Hook Form
                      handleImagePreview(filesArray);
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default GalleryForm;

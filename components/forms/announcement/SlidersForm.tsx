"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { sliderPlaceholder } from "@/public";
import { Trash } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { FieldArrayWithId, UseFieldArrayRemove } from "react-hook-form";

interface Props {
  form: any;
  images?: {
    url: string;
  }[];
  remove: UseFieldArrayRemove;
  fields: FieldArrayWithId<
    {
      images: {
        active: boolean;
        link?: string | undefined;
        image?: File | undefined;
      }[];
    },
    "images",
    "id"
  >[];
}

const SlidersForm = ({ form, remove, fields, images }: Props) => {
  // HOOKS
  const [previews, setPreviews] = useState<{ id?: string; url: string }[]>([]);

  useEffect(() => {
    if (images && previews.length === 0) {
      setPreviews(
        images.map((img, i) => ({ id: fields[i]?.id, url: img.url }))
      );
    }
  }, [images, previews.length]);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue(`images.${index}.image`, file, { shouldValidate: true });

      const objectUrl = URL.createObjectURL(file);
      setPreviews((prev) => {
        const newPreviews = [...prev];
        newPreviews[index] = { id: fields[index].id, url: objectUrl };
        return newPreviews;
      });
    }
  };

  const handleImageRemove = (index: number) => {
    form.setValue(`images.${index}.image`, undefined, { shouldValidate: true });

    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      <FormItem>
        <div className="space-y-2">
          {fields.map((field, index) => (
            <div key={fields[index].id} className="flex flex-col gap-2">
              <Accordion type="single" collapsible>
                <AccordionItem value={`item-${index}`} className="card py-0">
                  <AccordionTrigger>Slider {index + 1}</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      <FormField
                        control={form.control}
                        name={`images.${index}.active`}
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

                      <div>
                        <FormField
                          control={form.control}
                          name={`images.${index}.image`}
                          render={() => (
                            <FormItem className="flex flex-col gap-2">
                              <FormLabel htmlFor={`slider-${fields[index].id}`}>
                                <div className="relative group">
                                  <Image
                                    alt="Preview"
                                    src={
                                      previews[index]?.url || sliderPlaceholder
                                    }
                                    width={500}
                                    height={500}
                                    className="w-full h-[150px] object-cover overflow-hidden rounded-sm cursor-pointer"
                                  />
                                  {previews[index] && (
                                    <Button
                                      type="button"
                                      onClick={() => handleImageRemove(index)}
                                      variant="secondary"
                                      className="absolute top-0 left-0 m-1 hidden group-hover:flex"
                                    >
                                      Delete
                                    </Button>
                                  )}
                                </div>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="file"
                                  id={`slider-${fields[index].id}`}
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleFileChange(e, index)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name={`images.${index}.link`}
                        render={({ field }) => (
                          <FormItem className="px-0.5 w-full">
                            <FormLabel>Link</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={`Link ${index + 1}`}
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <Button
                        type="button"
                        onClick={() => remove(index)}
                        variant="secondary"
                        size="icon"
                      >
                        <Trash />
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          ))}
        </div>
      </FormItem>
    </div>
  );
};

export default SlidersForm;

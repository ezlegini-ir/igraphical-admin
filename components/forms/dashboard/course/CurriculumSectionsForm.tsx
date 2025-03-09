"use client";

import Table from "@/components/Table";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { TableCell, TableRow } from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { CourseFormType } from "@/lib/validationSchema";
import { Download, File, Plus, Trash, Video, X } from "lucide-react";
import { Control, useFieldArray } from "react-hook-form";

interface SectionProps {
  sectionIndex: number;
  control: Control<CourseFormType>;
  removeSection: (index: number) => void;
}

const CurriculumSectionsForm: React.FC<SectionProps> = ({
  sectionIndex,
  control,
  removeSection,
}) => {
  // Single hook instance for lessons for this section
  const {
    fields: lessonFields,
    append: appendLesson,
    remove: removeLesson,
  } = useFieldArray({
    name: `curriculum.${sectionIndex}.lessons` as const,
    control,
  });

  // Render a row for a single lesson using its index
  const renderRows = (item: any, index: number = 0) => (
    <TableRow className="odd:bg-slate-50" key={item.id || index}>
      <TableCell>
        <div className="card p-4 w- h- aspect-square flex items-center justify-center text-gray-500 font-medium text-sm">
          {index + 1}
        </div>
      </TableCell>

      <TableCell>
        <FormField
          control={control}
          name={`curriculum.${sectionIndex}.lessons.${index}.title` as const}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  dir="rtl"
                  className="text-left text-gray-600"
                  placeholder="Lesson Title"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </TableCell>

      <TableCell>
        <FormField
          control={control}
          name={`curriculum.${sectionIndex}.lessons.${index}.url` as const}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  className="text-gray-600"
                  placeholder="Lesson Url"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </TableCell>

      <TableCell>
        <FormField
          control={control}
          name={`curriculum.${sectionIndex}.lessons.${index}.duration` as const}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  min={0}
                  type="number"
                  value={field.value ?? ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    // If the input is empty, set it as undefined
                    field.onChange(value === "" ? 0 : Number(value));
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </TableCell>

      <TableCell>
        <FormField
          control={control}
          name={`curriculum.${sectionIndex}.lessons.${index}.type` as const}
          render={({ field }) => (
            <FormItem>
              <div className="flex flex-col gap-1">
                <div className="flex justify-start">
                  <ToggleGroup
                    className="data-[state=on]:bg-primary"
                    type="single"
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <ToggleGroupItem
                      className="w-9 h-9 aspect-square data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                      value="VIDEO"
                      aria-label="Video"
                    >
                      <Video className="scale-90" />
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      className="w-9 h-9 data-[state=on]:bg-orange-400 data-[state=on]:text-primary-foreground"
                      value="ASSET"
                      aria-label="Asset"
                    >
                      <Download className="scale-90" />
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      className="w-9 h-9 data-[state=on]:bg-slate-200 data-[state=on]:text-secondary-foreground"
                      value="FILE"
                      aria-label="File"
                    >
                      <File className="scale-90" />
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
      </TableCell>

      <TableCell>
        <FormField
          control={control}
          name={`curriculum.${sectionIndex}.lessons.${index}.isFree` as const}
          render={({ field }) => (
            <FormItem>
              <div className="flex flex-col gap-1">
                <FormControl>
                  <Switch
                    className="data-[state=checked]:bg-green-500"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </TableCell>

      <TableCell>
        <Button
          variant="outline"
          size={"icon"}
          onClick={() => removeLesson(index)}
          className="bg-transparent w-9 h-9 aspect-square hover:bg-destructive hover:text-destructive-foreground"
        >
          <Trash />
        </Button>
      </TableCell>
    </TableRow>
  );

  // Use the Table component's expected API: pass the lessonFields array as data and
  // let the Table component iterate over it using our renderRow function.
  return (
    <div className="space-y-3">
      <div className=" card mb-4 p-4 border space-y-3">
        <FormField
          control={control}
          name={`curriculum.${sectionIndex}.sectionTitle` as const}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Section Title</FormLabel>
              <FormControl>
                <div className="flex gap-1">
                  <div className="card p-4 font-medium text-sm h-10 aspect-square flex items-center justify-center bg-blue-100">
                    {sectionIndex + 1}
                  </div>

                  <Input
                    dir="rtl"
                    className="text-left"
                    placeholder="Section Title"
                    {...field}
                  />

                  <Button
                    variant="outline"
                    onClick={() => removeSection(sectionIndex)}
                  >
                    <X className="text-destructive" />
                    Remove
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Table
          columns={columns}
          data={lessonFields} // Pass the actual lessons array
          renderRows={renderRows}
          noDataMessage="No Lessons Added"
        />

        <div className="space-y-2">
          <Button
            size={"sm"}
            variant="secondary"
            type="button"
            onClick={() =>
              appendLesson({
                title: "",
                duration: undefined,
                url: "",
                isFree: false,
                type: "VIDEO",
              })
            }
          >
            <Plus />
            Add Lesson
          </Button>
        </div>
      </div>

      <Separator />
    </div>
  );
};

export default CurriculumSectionsForm;

const columns = [
  { label: "Num", className: "w-[20px]" },
  { label: "Title", className: "" },
  { label: "Url", className: "" },
  { label: "Duration", className: "" },
  { label: "Type", className: "w-[80px]" },
  { label: "Is Free?", className: "w-[80px]" },
  { label: "Delete", className: "text-right w-[40px]" },
];

"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import CurriculumSectionsForm from "./CurriculumSectionsForm";
import { Plus } from "lucide-react";

// Define types for your form data
export type Lesson = {
  title: string;
  duration?: number;
  url: string;
  isFree: boolean;
  type: "VIDEO" | "FILE" | "ASSET"; // update as needed based on your lessonsType
};

export type SectionType = {
  sectionTitle: string;
  lessons: Lesson[];
};

export type FormData = {
  curriculum: SectionType[];
};

const formSchema = z.object({
  curriculum: z.array(
    z.object({
      sectionTitle: z.string().min(1, "Section title is required"),
      lessons: z.array(
        z.object({
          title: z.string().min(1, "Lesson title is required"),
          duration: z
            .number()
            .min(0, "Lesson duration must be a non-negative number")
            .optional(),
          url: z.string(),
          isFree: z.boolean(),
          type: z.enum(["VIDEO", "FILE", "ASSET"]),
        })
      ),
    })
  ),
});

const CurriculumForm: React.FC = () => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      curriculum: [
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

  const {
    fields: sectionFields,
    append: appendSection,
    remove: removeSection,
  } = useFieldArray({
    name: "curriculum",
    control: form.control,
  });

  return (
    <Form {...form}>
      <form
        className="space-y-3"
        onSubmit={form.handleSubmit((data) => console.log(data))}
      >
        {sectionFields.map((section, sectionIndex) => (
          <CurriculumSectionsForm
            key={section.id}
            sectionIndex={sectionIndex}
            control={form.control}
            removeSection={removeSection}
          />
        ))}

        <div>
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

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default CurriculumForm;

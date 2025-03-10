"use client";

import { createSlider, updateSlider } from "@/actions/slider";
import Error from "@/components/Error";
import Success from "@/components/Success";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import useError from "@/hooks/useError";
import useLoading from "@/hooks/useLoading";
import useSuccess from "@/hooks/useSuccess";
import { SlidersFormType, slidersFormSchema } from "@/lib/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image, Slider } from "@prisma/client";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import SlidersForm from "./SlidersForm";

export interface Sliders extends Slider {
  image: Image | null;
}

export interface SlidersProps {
  sliders?: Sliders[];
}

const MainSlidersForm = ({ sliders }: SlidersProps) => {
  // HOOKS
  const { error, setError } = useError();
  const { loading, setLoading } = useLoading();
  const { success, setSuccess } = useSuccess();
  const router = useRouter();

  const form = useForm<SlidersFormType>({
    resolver: zodResolver(slidersFormSchema),
    mode: "onSubmit",
    defaultValues: {
      images: sliders?.map((slider) => ({
        active: slider.active,
        link: slider.link || "", // Ensure it's always a string
        image: undefined, // File remains undefined if not provided
      })) || [
        {
          active: false,
          link: "", // Default to empty string
          image: undefined,
        },
      ],
    },
  });

  const { append, remove, fields } = useFieldArray({
    name: "images",
    control: form.control,
  });

  const onSubmit = async (data: SlidersFormType) => {
    setError("");
    setSuccess("");
    setLoading(true);

    const operationPromise = sliders?.length
      ? updateSlider(
          data,
          "MAIN",
          sliders.map((s) => s.id)
        )
      : createSlider(data, "MAIN");

    toast.promise(operationPromise, {
      loading: "Saving sliders...",
      success: (res) => {
        if (res.success) {
          router.refresh();
          form.reset(data);
          setLoading(false);
          return res.success;
        }
      },
      error: "Failed to update/create slider.",
    });
  };

  const images = sliders?.filter((s) => s.image).map((s) => s.image);

  return (
    <div className="w-full">
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex justify-between items-center">
            <h3>Main Slider</h3>

            <Button
              size={"sm"}
              className="px-10"
              type="submit"
              variant={"lightBlue"}
              disabled={
                loading || !form.formState.isValid || !form.formState.isDirty
              }
            >
              Save
            </Button>
          </div>

          <Error error={error} />
          <Success success={success} />

          <SlidersForm
            fields={fields}
            form={form}
            remove={remove}
            images={images}
            sliders={sliders}
          />
        </form>
      </Form>

      <Button
        type="button"
        onClick={() => append({ link: "", active: false, image: undefined })}
        variant="secondary"
        className="flex items-center gap-2 w-full mt-3"
      >
        <Plus size={16} />
        Add Slider
      </Button>
    </div>
  );
};

export default MainSlidersForm;

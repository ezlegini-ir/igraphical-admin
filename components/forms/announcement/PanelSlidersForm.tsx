"use client";

import Error from "@/components/Error";
import Loader from "@/components/Loader";
import Success from "@/components/Success";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import useError from "@/hooks/useError";
import useLoading from "@/hooks/useLoading";
import useSuccess from "@/hooks/useSuccess";
import { SlidersFormType, slidersFormSchema } from "@/lib/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { SlidersProps } from "./HomeSlidersForm";
import SlidersForm from "./SlidersForm";

const PanelSlidersForm = ({ sliders }: SlidersProps) => {
  // HOOKS
  const { error, setError } = useError();
  const { loading, setLoading } = useLoading();
  const { success, setSuccess } = useSuccess();

  const form = useForm<SlidersFormType>({
    resolver: zodResolver(slidersFormSchema),
    mode: "onSubmit",
    defaultValues: {
      images: sliders?.map((s) => {
        return { link: s.link, active: s.active, image: undefined };
      }),
    },
  });

  const { append, remove, fields } = useFieldArray({
    name: "images",
    control: form.control,
  });

  const onSubmit = async (data: SlidersFormType) => {
    setError("");
    setLoading(true);

    console.log(data);

    setSuccess("success");
    setLoading(false);
  };

  const images = sliders?.map((s) => {
    return { url: s.image };
  });

  return (
    <div className="w-full">
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex justify-between items-center">
            <h3>Panel Slider</h3>

            <Button
              size={"sm"}
              className="px-10"
              type="submit"
              disabled={loading}
            >
              <Loader loading={loading} />
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

export default PanelSlidersForm;

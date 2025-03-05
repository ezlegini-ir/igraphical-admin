"use client";

import { deleteImage } from "@/actions/image";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useError from "@/hooks/useError";
import useSuccess from "@/hooks/useSuccess";
import { avatar } from "@/public";
import { X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, Dispatch, SetStateAction } from "react";

interface Props {
  control: any;
  imagePreview?: string;
  setValue: any;
  public_id?: string;
  setImagePreview: Dispatch<SetStateAction<string | undefined>>;
}

const AvatarField = ({
  control,
  imagePreview,
  setImagePreview,
  setValue,
  public_id,
}: Props) => {
  //HOOKS
  const { error, setError } = useError();
  const { success, setSuccess } = useSuccess();
  const router = useRouter();

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>, field: any) => {
    setError("");

    const input = e.target;

    if (input.files?.length) {
      const file = input.files[0];

      // Allowed MIME types
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];
      const maxSize = 4 * 1024 * 1024; // 5MB in bytes

      if (!allowedTypes.includes(file.type)) {
        setError("Only Image Types Are Allowed.");
        input.value = "";
        return;
      }

      if (file.size > maxSize) {
        setError("must be less than 4mb");
        input.value = "";
        return;
      }

      field.onChange(file);
      setImagePreview(URL.createObjectURL(file));

      input.value = "";
    }
  };

  const handleImageRemove = async () => {
    setError("");
    setSuccess("");

    if (public_id) {
      const res = await deleteImage(public_id);

      if (res.error) {
        setError(res.error);
        return;
      }

      if (res.success) {
        setSuccess(res.success);
        setValue("image", undefined);
        setImagePreview(undefined);
        router.refresh();
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <FormField
        control={control}
        name="image"
        render={({ field }) => (
          <FormItem>
            <div className="relative rounded-full">
              <FormLabel htmlFor="file-upload">
                <Image
                  alt=""
                  src={imagePreview || avatar}
                  width={100}
                  height={100}
                  className="aspect-square rounded-full object-cover border-[1px] border-slate-400 hover:drop-shadow-md border-dashed  cursor-pointer relative "
                />
              </FormLabel>
              {imagePreview && (
                <Button
                  type="button"
                  onClick={() => handleImageRemove()}
                  variant={"secondary"}
                  className="absolute h-6 w-6 border top-0 m-1 bg-white"
                  size={"icon"}
                >
                  <X />
                </Button>
              )}
            </div>

            <FormControl>
              <Input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageChange(e, field)}
                id="file-upload"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-green-500 text-sm">{success}</p>}
    </div>
  );
};

export default AvatarField;

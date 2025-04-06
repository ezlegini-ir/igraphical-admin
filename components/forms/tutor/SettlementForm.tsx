"use client";

import {
  createSettlement,
  deleteSettlement,
  updateSettlement,
} from "@/actions/settlement";
import { deleteTutor } from "@/actions/tutor";
import { SettlementType } from "@/app/(DASHBOARD)/tutors/settlements/SettlementsList";
import Avatar from "@/components/Avatar";
import ComboField from "@/components/ComboField";
import DeleteButton from "@/components/DeleteButton";
import Loader from "@/components/Loader";
import { Badge } from "@/components/ui/badge";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import useLoading from "@/hooks/useLoading";
import { cn, formatPrice } from "@/lib/utils";
import {
  SettlementFormType,
  settlementFormSchema,
  settlementStatus,
} from "@/lib/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image, Tutor } from "@prisma/client";
import { format, startOfMonth } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface TutorType extends Tutor {
  image: Image | null;
}

interface Props {
  settlement?: SettlementType;
  type: "NEW" | "UPDATE";
  tutors?: TutorType[];
}

const SettlementForm = ({ type, settlement, tutors }: Props) => {
  // HOOKS
  const router = useRouter();
  const { loading, setLoading } = useLoading();

  const isUpdateType = type === "UPDATE";

  const form = useForm<SettlementFormType>({
    resolver: zodResolver(settlementFormSchema),
    mode: "onBlur",
    defaultValues: {
      date: {
        from: startOfMonth(new Date()),
        to: new Date(),
      },
      status: settlement?.status || "PENDING",
      tutorId: settlement?.tutorId.toString(),
    },
  });

  const onSubmit = async (data: SettlementFormType) => {
    setLoading(true);

    const res = isUpdateType
      ? await updateSettlement(data, settlement?.id!)
      : await createSettlement(data);

    if (res.error) {
      toast.error(res.error);
      setLoading(false);
      return;
    }

    if (res.success) {
      toast.success(res.success);
      router.refresh();
      setLoading(false);
    }
  };

  const onDelete = async () => {
    setLoading(true);

    const res = await deleteSettlement(settlement?.id!);

    if (res.error) {
      toast.error(res.error);
      setLoading(false);
    }

    if (res.success) {
      toast.success(res.success);
      router.refresh();
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
        {!isUpdateType ? (
          <div className="space-y-5">
            <FormField
              control={form.control}
              name="tutorId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="mb-1">Tutor</FormLabel>
                  <ComboField<TutorType>
                    options={tutors!}
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
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <FormLabel>From / To</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            <span>
                              {format(field.value.from, "PPP")} -{" "}
                              {format(field.value.to, "PPP")}
                            </span>
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="range"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date > new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ) : (
          <div>
            <ul className="space-y-3 text-sm">
              <li className="flex flex-col items-center gap-2 text-base">
                <Avatar size={75} src={settlement?.tutor.image?.url} />
                {settlement?.tutor.name}
              </li>

              <Separator />

              <li className="flex justify-between">
                From:
                <span> {format(settlement?.from!, "PPP")}</span>
              </li>

              <li className="flex justify-between">
                To:
                <span> {format(settlement?.to!, "PPP")}</span>
              </li>

              <li className="flex justify-between">
                Status:
                <Badge
                  variant={
                    settlement?.status === "PENDING" ? "orange" : "green"
                  }
                >
                  {settlement?.status}
                </Badge>
              </li>

              <Separator />

              <Badge variant={"blue"} className="flex py-3 justify-between">
                Amount:
                <span> {formatPrice(settlement?.amount)}</span>
              </Badge>

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel>Status</FormLabel> */}
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {settlementStatus.map((item, index) => (
                          <SelectItem key={index} value={item}>
                            <span
                              className={`${item === "PENDING" ? "text-orange-500" : "text-green-500"}`}
                            >
                              {item}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </ul>
          </div>
        )}

        <Button
          disabled={!form.formState.isValid || loading}
          className="w-full flex gap-2"
          type="submit"
        >
          {<Loader loading={loading} />}
          {isUpdateType ? "Update" : "Create"}
        </Button>

        {isUpdateType && <DeleteButton onDelete={onDelete} />}
      </form>
    </Form>
  );
};

export default SettlementForm;

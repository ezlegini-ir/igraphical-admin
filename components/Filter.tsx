"use client";

import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Select as UiSelect,
} from "@/components/ui/select";
import useValue from "@/hooks/useValue";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

interface SelectProps {
  name?: string;
  options: { label: string; value: string }[];
  defaultValue?: string;
  placeholder?: string;
}

const Filter: React.FC<SelectProps> = ({
  name = "filter",
  options,
  defaultValue = "all",
  placeholder = "Select...",
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read the current query parameter or set to default
  const currentQuery = searchParams.get(name) || defaultValue;
  const { value, setValue } = useValue(currentQuery);

  const handleChange = (newValue: string) => {
    setValue(newValue);
    const params = new URLSearchParams(Array.from(searchParams.entries()));

    if (newValue === "all") {
      // Remove the query if it is "all"
      params.delete(name);
    } else {
      // Otherwise, update the query parameter
      params.set(name, newValue);
    }

    // Push the new query string while keeping other parameters
    router.push(`?${params.toString()}`);
  };

  useEffect(() => {
    setValue(currentQuery);
  }, [currentQuery]);

  return (
    <UiSelect value={value} onValueChange={handleChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={"all"}>{placeholder}</SelectItem>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </UiSelect>
  );
};

export default Filter;

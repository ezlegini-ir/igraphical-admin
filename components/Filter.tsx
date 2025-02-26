"use client";

import React, { useEffect, useState } from "react";
import {
  Select as UiSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import useValue from "@/hooks/useValue";

// Define props for the reusable Select component
interface SelectProps {
  name?: string; // The query parameter name (e.g., "filter", "sort", "category")
  options: { label: string; value: string }[]; // Array of options
  defaultValue?: string; // Default value if the query parameter is not present
  placeholder?: string; // Placeholder text for the Select component
}

const Filter: React.FC<SelectProps> = ({
  name = "filter",
  options,
  defaultValue = "",
  placeholder = "Select...",
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read the current value of the query parameter from the URL
  const currentQuery = searchParams.get(name) || defaultValue;
  const { value, setValue } = useValue(currentQuery);

  const handleChange = (newValue: string) => {
    setValue(newValue);
    const params = new URLSearchParams(Array.from(searchParams.entries()));

    if (newValue) {
      params.set(name, newValue);
    } else {
      params.delete(name);
    }

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

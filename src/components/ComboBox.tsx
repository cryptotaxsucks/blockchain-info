"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ComboBoxType } from "@/types/ComboBox";
import { Badge } from "./ui/badge";

const PopoverDefault = ({
  data,
  label,
  handleChange,
  value,
  open,
  setOpen,
}: {
  data: string[];
  label: string;
  handleChange: (value: string) => void;
  value: string;
  open: boolean;
  setOpen: (value: boolean) => void;
}) => {
  return (
    <div className="w-full">
      <PopoverTrigger asChild>
        <Button
          id="combobox"
          aria-label="combobox"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="flex w-full justify-between text-sm capitalize sm:text-lg"
        >
          {value
            ? data.find((item) => item.toLowerCase() === value.toLowerCase())
            : `Select ${label}`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-popover-content p-0">
        <Command className="">
          <CommandInput
            placeholder={`Search ${label}...`}
            className="text-sm sm:text-lg"
          />
          <CommandEmpty className="flex justify-center p-10 text-sm sm:text-lg">
            No {label} found.
          </CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-y-scroll">
            {data.map((item) => (
              <CommandItem
                key={item}
                value={item}
                onSelect={(currentValue) => {
                  handleChange(currentValue);
                  setOpen(false);
                }}
                className="text-sm capitalize sm:text-lg"
              >
                <Check
                  className={cn(
                    "mr-2 h-5 w-5",
                    value.toLowerCase() === item.toLowerCase()
                      ? "opacity-100"
                      : "opacity-0",
                  )}
                />
                {item}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </div>
  );
};

const PopoverMultiple = ({
  data,
  label,
  handleChange,
  value,
  open,
  setOpen,
}: {
  data: string[];
  label: string;
  handleChange: (value: string[]) => void;
  value: string[];
  open: boolean;
  setOpen: (value: boolean) => void;
}) => {
  return (
    <>
      <PopoverTrigger asChild>
        <Button
          id="combobox"
          aria-label="combobox"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="flex w-full items-center justify-between text-sm capitalize sm:text-lg"
        >
          {value.length > 0 ? (
            <div className="flex flex-row space-x-1 overflow-x-auto">
              {value.map((v: string, index: number) => (
                <div key={index}>
                  <Badge className="bg-theme-blue">{v}</Badge>
                </div>
              ))}
            </div>
          ) : (
            `Select ${label}`
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-popover-content p-0">
        <Command className="">
          <CommandInput
            placeholder={`Search ${label}...`}
            className="text-sm sm:text-lg"
          />
          <CommandEmpty className="flex justify-center p-10 text-sm sm:text-lg">
            No {label} found.
          </CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-y-scroll">
            {data.map((item) => (
              <CommandItem
                key={item}
                value={item}
                onSelect={(currentValue) => {
                  if (value.includes(currentValue)) {
                    handleChange(value.filter((v) => v !== currentValue));
                    return;
                  }
                  handleChange([...value, currentValue].sort());
                  setOpen(false);
                }}
                className="text-sm capitalize sm:text-lg"
              >
                <Check
                  className={cn(
                    "mr-2 h-5 w-5",
                    value.includes(item.toLowerCase())
                      ? "opacity-100"
                      : "opacity-0",
                  )}
                />
                {item}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </>
  );
};

const PopoverBoolean = ({
  data,
  label,
  handleChange,
  value,
  open,
  setOpen,
}: {
  data: string[];
  label: string;
  handleChange: (value: boolean) => void;
  value: boolean;
  open: boolean;
  setOpen: (value: boolean) => void;
}) => {
  return (
    <>
      <PopoverTrigger asChild>
        <Button
          id="combobox"
          aria-label="combobox"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="flex w-full justify-between text-sm capitalize sm:text-lg"
        >
          {value === true ? "Yes" : value === false ? "No" : `Select ${label}`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-popover-content p-0">
        <Command className="">
          <CommandGroup className="max-h-[300px] overflow-y-scroll">
            {data.map((item) => (
              <CommandItem
                key={item}
                value={item}
                onSelect={(currentValue) => {
                  handleChange(currentValue.toLowerCase() === "yes");
                  setOpen(false);
                }}
                className="text-sm capitalize sm:text-lg"
              >
                <Check
                  className={cn(
                    "mr-2 h-5 w-5",
                    (value === true && item === "Yes") ||
                      (value === false && item === "No")
                      ? "opacity-100"
                      : "opacity-0",
                  )}
                />

                {item}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </>
  );
};

export function Combobox({
  data,
  label,
  variant = ComboBoxType.DEFAULT,
  handleChange,
  value,
}: {
  data: string[];
  label: string;
  variant?: ComboBoxType;
  handleChange: (value: string | boolean | string[]) => void;
  value: string | boolean | string[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        {variant === ComboBoxType.DEFAULT && typeof value === "string" ? (
          <PopoverDefault
            data={data}
            label={label}
            handleChange={handleChange}
            value={value}
            open={open}
            setOpen={setOpen}
          />
        ) : variant === ComboBoxType.MULTIPLE ? (
          <PopoverMultiple
            data={data}
            label={label}
            handleChange={handleChange}
            value={value as string[]}
            open={open}
            setOpen={setOpen}
          />
        ) : (
          variant === ComboBoxType.BOOLEAN && (
            <PopoverBoolean
              data={data}
              label={label}
              handleChange={handleChange}
              value={value as boolean}
              open={open}
              setOpen={setOpen}
            />
          )
        )}
      </Popover>
    </>
  );
}

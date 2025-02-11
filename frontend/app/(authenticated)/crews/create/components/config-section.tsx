"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../schema";

interface ConfigSectionProps {
  form: UseFormReturn<FormValues>;
}

export function ConfigSection({ form }: ConfigSectionProps) {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="process"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Process</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a process type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="sequential">Sequential</SelectItem>
                <SelectItem value="hierarchical">Hierarchical</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>How should tasks be processed?</FormDescription>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="manager_llm"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Manager LLM</FormLabel>
            <FormControl>
              <Input placeholder="Enter manager LLM" {...field} />
            </FormControl>
            <FormDescription>LLM for the manager agent</FormDescription>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="function_calling_llm"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Function Calling LLM</FormLabel>
            <FormControl>
              <Input placeholder="Enter function calling LLM" {...field} />
            </FormControl>
            <FormDescription>LLM for function calling</FormDescription>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="max_rpm"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Max RPM</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Enter max RPM"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value))}
              />
            </FormControl>
            <FormDescription>Maximum requests per minute</FormDescription>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="language"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Language</FormLabel>
            <FormControl>
              <Input placeholder="Enter language" {...field} />
            </FormControl>
            <FormDescription>Language for the crew</FormDescription>
          </FormItem>
        )}
      />

      <div className="space-y-4">
        <FormField
          control={form.control}
          name="verbose"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Verbose</FormLabel>
                <FormDescription>
                  Enable detailed logging for debugging
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="memory"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Memory</FormLabel>
                <FormDescription>
                  Enable memory for the crew
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="planning"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Planning</FormLabel>
                <FormDescription>
                  Enable planning for the crew
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

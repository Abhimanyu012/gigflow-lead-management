import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Select } from "../../components/ui/Select";
import { Lead } from "../../types/lead.types";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z
    .string()
    .optional()
    .refine((v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), {
      message: "Invalid email address",
    }),
  status: z.enum(["New", "Contacted", "Qualified", "Lost"]),
  source: z.enum(["Website", "Instagram", "Referral"]),
});

type FormData = z.infer<typeof schema>;

const STATUS_OPTIONS = [
  { value: "New", label: "New" },
  { value: "Contacted", label: "Contacted" },
  { value: "Qualified", label: "Qualified" },
  { value: "Lost", label: "Lost" },
];

const SOURCE_OPTIONS = [
  { value: "Website", label: "Website" },
  { value: "Instagram", label: "Instagram" },
  { value: "Referral", label: "Referral" },
];

interface LeadFormProps {
  initialData?: Lead;
  onSubmit: (data: Partial<Lead>) => void;
  onCancel: () => void;
  isViewOnly?: boolean;
}

export const LeadForm: React.FC<LeadFormProps> = ({ initialData, onSubmit, onCancel, isViewOnly = false }) => {
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData || { status: "New", source: "Website" },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-2 pb-16">
      <Input
        label="Full Name"
        placeholder="e.g. Jane Smith"
        {...register("name")}
        error={errors.name?.message}
        disabled={isViewOnly}
      />
      <Input
        label="Email Address"
        type="email"
        placeholder="jane@company.com"
        {...register("email")}
        error={errors.email?.message}
        disabled={isViewOnly}
      />

      <div className="grid grid-cols-2 gap-4">
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select
              label="Status"
              options={STATUS_OPTIONS}
              value={field.value}
              onChange={field.onChange}
              error={errors.status?.message}
              disabled={isViewOnly}
            />
          )}
        />

        <Controller
          name="source"
          control={control}
          render={({ field }) => (
            <Select
              label="Source"
              options={SOURCE_OPTIONS}
              value={field.value}
              onChange={field.onChange}
              error={errors.source?.message}
              disabled={isViewOnly}
            />
          )}
        />
      </div>

      <div className="flex justify-end gap-3 pt-1">
        {isViewOnly ? (
          <Button type="button" onClick={onCancel} className="w-full">
            Close Details
          </Button>
        ) : (
          <>
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Save Lead
            </Button>
          </>
        )}
      </div>
    </form>
  );
};

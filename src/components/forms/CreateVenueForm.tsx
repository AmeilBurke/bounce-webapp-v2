import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Controller, type Control, type FieldErrors } from "react-hook-form";
import FieldInput from "@/components/FieldInput";
import FieldImage from "@/components/FieldImage";
import FieldMultiSelect from "@/components/FieldMultiSelect";
import type { CreateVenueFormValues } from "@/schemas/create-venue.schema";
import { staffQueryOptions } from "@/api-requests/staff/staff.queries";
import { Role } from "@/types/Role";

type CreateVenueFieldsProps = {
  control: Control<CreateVenueFormValues>;
  errors: FieldErrors<CreateVenueFormValues>;
};

const CreateVenueForm = ({ control, errors }: CreateVenueFieldsProps) => {
  const { data: staff, isPending, isError } = useQuery(staffQueryOptions);

  const managerOptions = useMemo(
    () =>
      (staff ?? [])
        .filter((s) => s.role === Role.VENUE_MANAGER)
        .map((s) => ({ value: s.id, label: s.name })),
    [staff],
  );

  const managerPlaceholder = () => {
    if (isPending) return "Loading venue managers...";
    if (isError) return "Couldn't load venue managers";
    if (managerOptions.length === 0) return "No venue managers available";
    return "Select venue managers";
  };

  return (
    <>
      <Controller
        name="image"
        control={control}
        render={({ field: { value, onChange } }) => (
          <FieldImage
            isRequired
            label="Image"
            accept="image/jpeg,image/png,image/webp"
            value={value ?? []}
            onChange={onChange}
            error={errors.image?.message as string | undefined}
          />
        )}
      />

      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <FieldInput
            isRequired
            label="Name"
            value={field.value ?? ""}
            onChange={field.onChange}
            placeholder="Enter venue name"
            error={errors.name?.message}
          />
        )}
      />

      <Controller
        name="managers"
        control={control}
        render={({ field }) => (
          <FieldMultiSelect
            label="Venue Managers"
            placeholder={managerPlaceholder()}
            options={managerOptions}
            value={field.value ?? []}
            onChange={field.onChange}
            onBlur={field.onBlur}
            error={errors.managers?.message}
          />
        )}
      />
    </>
  );
};

export default CreateVenueForm;

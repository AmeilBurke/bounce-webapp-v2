import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Controller, type Control, type FieldErrors } from "react-hook-form";
import FieldInput from "@/components/FieldInput";
import FieldMultiSelect from "@/components/FieldMultiSelect";
import { FieldSkeleton } from "@/components/Skeletons";
import type { UpdateVenueFormValues } from "@/schemas/update-venue.schema";
import { staffQueryOptions } from "@/api-requests/staff/staff.queries";
import { Role } from "@/types/Role";

type UpdateVenueFieldsProps = {
  control: Control<UpdateVenueFormValues>;
  errors: FieldErrors<UpdateVenueFormValues>;
};

const UpdateVenueForm = ({ control, errors }: UpdateVenueFieldsProps) => {
  const { data: staff, isPending } = useQuery(staffQueryOptions);

  const managerOptions = useMemo(
    () =>
      (staff ?? [])
        .filter((s) => s.role === Role.VENUE_MANAGER)
        .map((s) => ({ value: s.id, label: s.name })),
    [staff],
  );

  // Venue managers can also act as duty managers
  const dutyManagerOptions = useMemo(
    () =>
      (staff ?? [])
        .filter((s) => s.role === Role.VENUE_MANAGER || s.role === Role.DUTY_MANAGER)
        .map((s) => ({ value: s.id, label: s.name })),
    [staff],
  );

  const nameField = (
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
  );

  if (isPending) {
    return (
      <>
        {nameField}
        <FieldSkeleton label="Venue Managers" />
        <FieldSkeleton label="Duty Managers" />
      </>
    );
  }

  return (
    <>
      {nameField}

      <Controller
        name="managers"
        control={control}
        render={({ field }) => (
          <FieldMultiSelect
            label="Venue Managers"
            placeholder={
              managerOptions.length === 0 ? "No venue managers available" : "Select venue managers"
            }
            options={managerOptions}
            value={field.value ?? []}
            onChange={field.onChange}
            onBlur={field.onBlur}
            error={errors.managers?.message}
          />
        )}
      />

      <Controller
        name="dutyManagers"
        control={control}
        render={({ field }) => (
          <FieldMultiSelect
            label="Duty Managers"
            placeholder={
              dutyManagerOptions.length === 0 ? "No duty managers available" : "Select duty managers"
            }
            options={dutyManagerOptions}
            value={field.value ?? []}
            onChange={field.onChange}
            onBlur={field.onBlur}
            error={errors.dutyManagers?.message}
          />
        )}
      />
    </>
  );
};

export default UpdateVenueForm;

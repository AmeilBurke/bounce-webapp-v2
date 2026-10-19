import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Controller, type Control, type FieldErrors } from "react-hook-form";
import FieldMultiSelect from "@/components/FieldMultiSelect";
import type { UpdateVenueManagersFormValues } from "@/schemas/update-venue-managers.schema";
import { staffQueryOptions } from "@/api-requests/staff/staff.queries";
import { Role } from "@/types/Role";

type VenueManagersFieldsProps = {
  control: Control<UpdateVenueManagersFormValues>;
  errors: FieldErrors<UpdateVenueManagersFormValues>;
};

const VenueManagersForm = ({ control, errors }: VenueManagersFieldsProps) => {
  const { data: staff } = useQuery(staffQueryOptions);

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

  return (
    <>
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

export default VenueManagersForm;

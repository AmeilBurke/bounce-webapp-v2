import { Controller, useWatch, type Control, type FieldErrors } from "react-hook-form";
import FieldInput from "@/components/FieldInput";
import FieldDate from "@/components/FieldDate";
import FieldMultiSelect from "@/components/FieldMultiSelect";
import type { UpdateBanFormValues } from "@/schemas/update-ban.schema";

type Option = { label: string; value: string };

type UpdateBanFieldsProps = {
  control: Control<UpdateBanFormValues>;
  errors: FieldErrors<UpdateBanFormValues>;
  venueOptions: Option[];
};

const UpdateBanForm = ({ control, errors, venueOptions }: UpdateBanFieldsProps) => {
  const startDate = useWatch({ control, name: "startDate" });

  return (
    <>
      <Controller
        name="reason"
        control={control}
        render={({ field }) => (
          <FieldInput
            isRequired
            label="Reason"
            value={field.value ?? ""}
            onChange={field.onChange}
            placeholder="Enter reason"
            error={errors.reason?.message}
          />
        )}
      />

      <Controller
        name="startDate"
        control={control}
        render={({ field }) => (
          <FieldDate
            isRequired
            label="Start Date"
            value={field.value ?? ""}
            onChange={field.onChange}
            onBlur={field.onBlur}
            placeholder="Select start date"
            error={errors.startDate?.message}
          />
        )}
      />

      <Controller
        name="endDate"
        control={control}
        render={({ field }) => (
          <FieldDate
            isRequired
            label="End Date"
            value={field.value ?? ""}
            onChange={field.onChange}
            onBlur={field.onBlur}
            min={startDate}
            placeholder="Select end date"
            error={errors.endDate?.message}
          />
        )}
      />

      <Controller
        name="venueIds"
        control={control}
        render={({ field }) => (
          <FieldMultiSelect
            isRequired
            label="Venues"
            placeholder="Select venues"
            options={venueOptions}
            value={field.value ?? []}
            onChange={field.onChange}
            onBlur={field.onBlur}
            error={errors.venueIds?.message}
          />
        )}
      />
    </>
  );
};

export default UpdateBanForm;

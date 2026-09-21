import { Controller, type Control, type FieldErrors } from "react-hook-form";
import FieldInput from "@/components/FieldInput";
import FieldImage from "@/components/FieldImage";
import type { CreateAlertFormValues } from "@/schemas/create-alert.schema";

type CreateAlertFieldsProps = {
  control: Control<CreateAlertFormValues>;
  errors: FieldErrors<CreateAlertFormValues>;
};

const CreateAlertForm = ({ control, errors }: CreateAlertFieldsProps) => {
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
    </>
  );
};

export default CreateAlertForm;
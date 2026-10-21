import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Controller, useWatch, type Control, type FieldErrors } from "react-hook-form";
import FieldInput from "@/components/FieldInput";
import FieldImage from "@/components/FieldImage";
import FieldSingleSelect from "@/components/FieldSingleSelect";
import { FieldSkeleton } from "@/components/Skeletons";
import { NEW_PERSON, type CreateAlertFormValues } from "@/schemas/create-alert.schema";
import { bannedPeopleNamesQueryOptions } from "@/api-requests/banned-people/banned-people.queries";

type CreateAlertFieldsProps = {
  control: Control<CreateAlertFormValues>;
  errors: FieldErrors<CreateAlertFormValues>;
};

const CreateAlertForm = ({ control, errors }: CreateAlertFieldsProps) => {
  const { data: bannedPeople, isPending: isPeoplePending } = useQuery(bannedPeopleNamesQueryOptions);
  const personId = useWatch({ control, name: "personId" });

  const personOptions = useMemo(
    () => [
      { value: NEW_PERSON, label: "+ New person" },
      ...(bannedPeople ?? []).map((p) => ({ value: p.id, label: p.name })),
    ],
    [bannedPeople],
  );

  return (
    <>
      {isPeoplePending ? (
        <FieldSkeleton label="Person" isRequired />
      ) : (
        <Controller
          control={control}
          name="personId"
          render={({ field }) => (
            <FieldSingleSelect
              label="Person"
              placeholder="Choose someone previously banned or add a new person"
              options={personOptions}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              isRequired
              error={errors.personId?.message}
            />
          )}
        />
      )}

      {personId === NEW_PERSON && (
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
      )}

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

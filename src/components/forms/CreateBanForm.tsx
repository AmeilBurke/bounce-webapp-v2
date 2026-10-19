import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Controller, useWatch, type Control, type FieldErrors } from "react-hook-form";
import FieldInput from "@/components/FieldInput";
import FieldImage from "@/components/FieldImage";
import FieldDate from "@/components/FieldDate";
import FieldSingleSelect from "@/components/FieldSingleSelect";
import FieldMultiSelect from "@/components/FieldMultiSelect";
import { NEW_PERSON, type CreateBanFormValues } from "@/schemas/create-ban.schema";
import { bannedPeopleQueryOptions } from "@/api-requests/banned-people/banned-people.queries";
import { venuesQueryOptions } from "@/api-requests/venues/venues.queries";

type CreateBanFieldsProps = {
  control: Control<CreateBanFormValues>;
  errors: FieldErrors<CreateBanFormValues>;
};

const CreateBanForm = ({ control, errors }: CreateBanFieldsProps) => {
  const { data: bannedPeople } = useQuery(bannedPeopleQueryOptions);
  const { data: venues } = useQuery(venuesQueryOptions);
  const personId = useWatch({ control, name: "personId" });
  const startDate = useWatch({ control, name: "startDate" });

  const personOptions = useMemo(
    () => [
      { value: NEW_PERSON, label: "+ New person" },
      ...(bannedPeople ?? []).map((p) => ({ value: p.id, label: p.name })),
    ],
    [bannedPeople],
  );

  const venueOptions = useMemo(
    () => (venues ?? []).map((v) => ({ value: v.id, label: v.name })),
    [venues],
  );

  return (
    <>
      <Controller
        control={control}
        name="personId"
        render={({ field }) => (
          <FieldSingleSelect
            label="Person"
            placeholder="Choose a person or add a new one"
            options={personOptions}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            isRequired
            error={errors.personId?.message}
          />
        )}
      />

      {personId === NEW_PERSON && (
        <>
          <Controller
            name="image"
            control={control}
            render={({ field: { value, onChange } }) => (
              <FieldImage
                isRequired
                label="Photo"
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
                placeholder="Enter their name"
                error={errors.name?.message}
              />
            )}
          />
        </>
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

export default CreateBanForm;

import { Controller, type Control, type FieldErrors } from "react-hook-form";
import FieldInput from "@/components/FieldInput";
import type { CreateStaffFormValues } from '@/schemas/create-staff.schema'
import { Role } from "@/types/Role";
import FieldSingleSelect from "../FieldSingleSelect";

type CreateStaffFieldsProps = {
  control: Control<CreateStaffFormValues>;
  errors: FieldErrors<CreateStaffFormValues>;
};

const CreateStaffForm = ({ control, errors }: CreateStaffFieldsProps) => {

  const roleOptions = Object.values(Role).map((role) => ({
    value: role,
    label: role.charAt(0) + role.slice(1).toLowerCase(), // "ADMIN" -> "Admin"
  }));

  // name
  // email
  // password
  // role

  return (
    <>
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <FieldInput
            isRequired
            label="Name"
            value={field.value ?? ""}
            onChange={field.onChange}
            placeholder="Enter name"
            error={errors.name?.message}
          />
        )}
      />

      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <FieldInput
            isRequired
            label="Email"
            value={field.value ?? ""}
            onChange={field.onChange}
            placeholder="Enter email"
            error={errors.email?.message}
          />
        )}
      />

      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <FieldInput
            isRequired
            label="Password"
            type="password"
            autoComplete="new-password"
            value={field.value}
            onChange={field.onChange}
            placeholder="Enter Password"
            error={errors.password?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="role"
        render={({ field }) => (
          <FieldSingleSelect
            label="Role"
            placeholder="Select a role"
            options={roleOptions}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            isRequired
            error={errors.role?.message}
          />
        )}
      />
    </>
  );
};

export default CreateStaffForm;
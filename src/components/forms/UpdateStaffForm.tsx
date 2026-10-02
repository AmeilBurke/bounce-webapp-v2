import { Controller, type Control, type FieldErrors } from "react-hook-form";
import FieldInput from "@/components/FieldInput";
import { Role } from "@/types/Role";
import FieldSingleSelect from "../FieldSingleSelect";
import type { EditStaffFormValues } from "@/schemas/update-staff.schema";
import { userDetailsQueryOptions } from "@/api-requests/auth/user.queries";
import { useQuery } from "@tanstack/react-query";

type UpdateStaffFieldsProps = {
    control: Control<EditStaffFormValues>;
    errors: FieldErrors<EditStaffFormValues>;
};

const UpdateStaffForm = ({ control, errors }: UpdateStaffFieldsProps) => {
    const roleOptions = Object.values(Role).map((role) => ({
        value: role,
        label: role.charAt(0) + role.slice(1).toLowerCase(),
    }));

    const { data: user } = useQuery(userDetailsQueryOptions);

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
                        label="New Password"
                        type="password"
                        autoComplete="new-password"
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        placeholder="Enter A New Password"
                        error={errors.password?.message}
                    />
                )}
            />

            {
                user?.role === Role.ADMIN &&
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
            }
        </>
    );
};

export default UpdateStaffForm;

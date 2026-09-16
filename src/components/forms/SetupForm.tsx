import type { SetupFormValues } from "@/schemas/setup.schema";
import { type Control, type FieldErrors, Controller } from "react-hook-form";
import FieldInput from "../FieldInput";

type SetupInputsProps = {
    control: Control<SetupFormValues>;
    errors: FieldErrors<SetupFormValues>;
};

const SetupForm = ({ control, errors }: SetupInputsProps) => {
    return (
        <>
            <Controller
                name="name"
                control={control}
                render={({ field }) => (
                    <FieldInput
                        isRequired
                        label="Name"
                        autoComplete="name"
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Enter Name"
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
                        type="email"
                        autoComplete="email"
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Enter Email"
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
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                    <FieldInput
                        isRequired
                        label="Confirm Password"
                        type="password"
                        autoComplete="new-password"
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Re-enter Password"
                        error={errors.confirmPassword?.message}
                    />
                )}
            />
        </>
    )
}

export default SetupForm
import { type Control, type FieldErrors, Controller } from "react-hook-form";
import FieldInput from "../FieldInput";
import type { SignInFormValues } from "@/schemas/sign-in.schema";

type SetupInputsProps = {
    control: Control<SignInFormValues>;
    errors: FieldErrors<SignInFormValues>;
};

const SignInForm = ({ control, errors }: SetupInputsProps) => {
    return (
        <>
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
        </>
    );
};

export default SignInForm;

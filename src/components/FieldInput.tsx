import type { HTMLInputAutoCompleteAttribute } from "react";
import { Field, Input } from "@chakra-ui/react";

type FieldInputProps = {
    label: string;
    placeholder: string;
    value: string;
    onChange: (text: string) => void;
    type?: "text" | "email" | "password";
    isRequired?: boolean;
    autoComplete?: HTMLInputAutoCompleteAttribute;
    error?: string;
};

const FieldInput = ({
    label,
    placeholder,
    value,
    onChange,
    type = "text",
    isRequired,
    autoComplete,
    error,
}: FieldInputProps) => {
    return (
        <Field.Root w="full" required={isRequired} invalid={!!error}>
            <Field.Label>
                {label} <Field.RequiredIndicator />
            </Field.Label>
            <Input
                w="full"
                value={value}
                onChange={(event) => {
                    onChange(event.target.value);
                }}
                autoComplete={autoComplete}
                type={type}
                placeholder={placeholder}
                variant="flushed"
            />
            {error && <Field.ErrorText>{error}</Field.ErrorText>}
        </Field.Root>
    );
};

export default FieldInput;
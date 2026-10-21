import type { HTMLInputAutoCompleteAttribute } from "react";
import { Field, Input, InputGroup } from "@chakra-ui/react";
import { LuSearch } from "react-icons/lu";

type FieldInputProps = {
    label: string;
    placeholder: string;
    value: string;
    onChange: (text: string) => void;
    type?: "text" | "email" | "password";
    isRequired?: boolean;
    autoComplete?: HTMLInputAutoCompleteAttribute;
    error?: string;
    // Adds a search icon and hides the label, which the icon and placeholder already explain
    isSearch?: boolean;
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
    isSearch,
}: FieldInputProps) => {
    const input = (
        <Input
            w="full"
            bg="bg.panel"
            value={value}
            onChange={(event) => {
                onChange(event.target.value);
            }}
            autoComplete={autoComplete}
            type={isSearch ? "search" : type}
            placeholder={placeholder}
            aria-label={isSearch ? label : undefined}
        />
    );

    return (
        <Field.Root w="full" required={isRequired} invalid={!!error}>
            {!isSearch && (
                <Field.Label>
                    {label} <Field.RequiredIndicator />
                </Field.Label>
            )}
            {isSearch ? <InputGroup startElement={<LuSearch />}>{input}</InputGroup> : input}
            {error && <Field.ErrorText>{error}</Field.ErrorText>}
        </Field.Root>
    );
};

export default FieldInput;

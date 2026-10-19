import { useMemo } from "react";
import { Field, Portal, Select, createListCollection } from "@chakra-ui/react";

type Option = { label: string; value: string };

type FieldMultiSelectProps = {
    label: string;
    placeholder: string;
    options: Option[];
    value: string[];
    onChange: (value: string[]) => void;
    onBlur?: () => void;
    isRequired?: boolean;
    error?: string;
};

const FieldMultiSelect = ({
    label,
    placeholder,
    options,
    value,
    onChange,
    onBlur,
    isRequired,
    error,
}: FieldMultiSelectProps) => {
    const collection = useMemo(
        () => createListCollection({ items: options }),
        [options],
    );

    return (
        <Field.Root w="full" required={isRequired} invalid={!!error}>
            <Field.Label>
                {label} <Field.RequiredIndicator />
            </Field.Label>
            <Select.Root
                multiple
                collection={collection}
                value={value}
                onValueChange={({ value: selected }) => onChange(selected)}
                onInteractOutside={() => onBlur?.()}
            >
                <Select.HiddenSelect />
                <Select.Control>
                    <Select.Trigger>
                        <Select.ValueText placeholder={placeholder} />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                        <Select.Indicator />
                    </Select.IndicatorGroup>
                </Select.Control>
                <Portal>
                    <Select.Positioner>
                        <Select.Content>
                            {collection.items.map((item) => (
                                <Select.Item item={item} key={item.value}>
                                    {item.label}
                                    <Select.ItemIndicator />
                                </Select.Item>
                            ))}
                        </Select.Content>
                    </Select.Positioner>
                </Portal>
            </Select.Root>
            {error && <Field.ErrorText>{error}</Field.ErrorText>}
        </Field.Root>
    );
};

export default FieldMultiSelect;

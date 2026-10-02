import { useMemo } from "react";
import { Field, Portal, Select, createListCollection } from "@chakra-ui/react";

type Option = { label: string; value: string };

type FieldSingleSelectProps = {
    label: string;
    placeholder: string;
    options: Option[];
    value?: string;
    onChange: (value: string) => void;
    onBlur?: () => void;
    isRequired?: boolean;
    error?: string;
};

const FieldSingleSelect = ({
    label,
    placeholder,
    options,
    value,
    onChange,
    onBlur,
    isRequired,
    error,
}: FieldSingleSelectProps) => {
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
                collection={collection}
                value={value ? [value] : []}
                onValueChange={({ value: selected }) =>
                    onChange(selected[0] ?? "")
                }
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

export default FieldSingleSelect;
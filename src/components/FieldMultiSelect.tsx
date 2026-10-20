import { useMemo } from "react";
import { Field, Portal, Select, createListCollection } from "@chakra-ui/react";

type Option = { label: string; value: string };

// Never sent as a real value, picking it selects or clears every option instead
const SELECT_ALL = "__select_all__";

type FieldMultiSelectProps = {
    label: string;
    placeholder: string;
    options: Option[];
    value: string[];
    onChange: (value: string[]) => void;
    onBlur?: () => void;
    isRequired?: boolean;
    error?: string;
    // Adds an entry at the top of the list that toggles every option
    selectAll?: boolean;
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
    selectAll,
}: FieldMultiSelectProps) => {
    const isAllSelected =
        options.length > 0 && options.every((option) => value.includes(option.value));

    const collection = useMemo(
        () =>
            createListCollection({
                items:
                    selectAll && options.length > 1
                        ? [
                              { value: SELECT_ALL, label: isAllSelected ? "Deselect all" : "Select all" },
                              ...options,
                          ]
                        : options,
            }),
        [options, selectAll, isAllSelected],
    );

    const handleValueChange = (selected: string[]) => {
        if (selected.includes(SELECT_ALL)) {
            onChange(isAllSelected ? [] : options.map((option) => option.value));
        } else {
            onChange(selected);
        }
    };

    return (
        <Field.Root w="full" required={isRequired} invalid={!!error}>
            <Field.Label>
                {label} <Field.RequiredIndicator />
            </Field.Label>
            <Select.Root
                multiple
                collection={collection}
                value={value}
                onValueChange={({ value: selected }) => handleValueChange(selected)}
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
                                <Select.Item
                                    item={item}
                                    key={item.value}
                                    fontWeight={item.value === SELECT_ALL ? "medium" : undefined}
                                >
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

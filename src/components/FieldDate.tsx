import { useMemo } from "react";
import { DatePicker, Field, Portal, parseDate } from "@chakra-ui/react";
import { LuCalendar } from "react-icons/lu";

// Values are YYYY-MM-DD strings, the same format as a native date input
type FieldDateProps = {
    label: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    onBlur?: () => void;
    min?: string;
    isRequired?: boolean;
    error?: string;
};

const safeParseDate = (value?: string) => {
    if (!value) return undefined;
    try {
        return parseDate(value);
    } catch {
        return undefined;
    }
};

const FieldDate = ({
    label,
    placeholder,
    value,
    onChange,
    onBlur,
    min,
    isRequired,
    error,
}: FieldDateProps) => {
    const selected = useMemo(() => safeParseDate(value), [value]);
    const minDate = useMemo(() => safeParseDate(min), [min]);

    return (
        <Field.Root w="full" required={isRequired} invalid={!!error}>
            <Field.Label>
                {label} <Field.RequiredIndicator />
            </Field.Label>
            <DatePicker.Root
                w="full"
                value={selected ? [selected] : []}
                onValueChange={({ value: dates }) => onChange(dates[0]?.toString() ?? "")}
                onOpenChange={({ open }) => {
                    if (!open) onBlur?.();
                }}
                min={minDate}
                closeOnSelect
            >
                <DatePicker.Control>
                    <DatePicker.Input placeholder={placeholder} bg="bg.panel" />
                    <DatePicker.IndicatorGroup>
                        <DatePicker.Trigger>
                            <LuCalendar />
                        </DatePicker.Trigger>
                    </DatePicker.IndicatorGroup>
                </DatePicker.Control>
                <Portal>
                    <DatePicker.Positioner>
                        <DatePicker.Content>
                            <DatePicker.View view="day">
                                <DatePicker.Header />
                                <DatePicker.DayTable />
                            </DatePicker.View>
                            <DatePicker.View view="month">
                                <DatePicker.Header />
                                <DatePicker.MonthTable />
                            </DatePicker.View>
                            <DatePicker.View view="year">
                                <DatePicker.Header />
                                <DatePicker.YearTable />
                            </DatePicker.View>
                        </DatePicker.Content>
                    </DatePicker.Positioner>
                </Portal>
            </DatePicker.Root>
            {error && <Field.ErrorText>{error}</Field.ErrorText>}
        </Field.Root>
    );
};

export default FieldDate;

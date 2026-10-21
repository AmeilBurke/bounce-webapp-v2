import { Text, type TextProps } from "@chakra-ui/react";

// Small uppercase heading that names a group of cards or details
const SectionLabel = (props: TextProps) => {
    return (
        <Text
            color="fg.muted"
            fontSize="xs"
            fontWeight="semibold"
            textTransform="uppercase"
            letterSpacing="0.08em"
            {...props}
        />
    );
};

export default SectionLabel;

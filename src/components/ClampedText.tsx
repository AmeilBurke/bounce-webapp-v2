import { Text, type TextProps } from "@chakra-ui/react";

type ClampedTextProps = Omit<TextProps, "children"> & {
    children: string;
    lines: number;
};

// Always takes up exactly `lines` lines, so cards in a grid line up whatever their text.
// Longer text is cut off with an ellipsis, and the full text shows on hover
const ClampedText = ({ children, lines, fontSize = "md", ...props }: ClampedTextProps) => {
    const lineHeight = fontSize === "sm" ? 1.25 : 1.5;

    return (
        <Text
            {...props}
            fontSize={fontSize}
            lineHeight={`${lineHeight}rem`}
            h={`${lines * lineHeight}rem`}
            lineClamp={lines}
            title={children}
            w="full"
        >
            {children}
        </Text>
    );
};

export default ClampedText;

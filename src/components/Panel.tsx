import { Box, type BoxProps } from "@chakra-ui/react";

type PanelProps = BoxProps & {
    // Shows the panel can be clicked by darkening its border on hover
    isClickable?: boolean;
};

// The white bordered card every list item, stat and form sits in
const Panel = ({ isClickable, ...props }: PanelProps) => {
    return (
        <Box
            bg="bg.panel"
            borderWidth="1px"
            rounded="xl"
            cursor={isClickable ? "pointer" : undefined}
            transition="border-color 0.15s"
            _hover={isClickable ? { borderColor: "border.emphasized" } : undefined}
            {...props}
        />
    );
};

export default Panel;

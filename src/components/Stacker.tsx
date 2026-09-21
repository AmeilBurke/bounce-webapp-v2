import { Stack } from "@chakra-ui/react";
import type { StackProps } from "@chakra-ui/react";
import type { ReactNode } from "react";

type StackerProps = {
  direction: StackProps["direction"];
  children: ReactNode;
  padding?: StackProps["padding"];
  gap?: StackProps["gap"];
  align?: StackProps["align"]
};

const Stacker = ({ direction, children, padding, gap = 8, align = "flex-start" }: StackerProps) => {
  return (
    <Stack direction={direction} w="full" p={padding} gap={gap} align={align}>
      {children}
    </Stack>
  );
};

export default Stacker;
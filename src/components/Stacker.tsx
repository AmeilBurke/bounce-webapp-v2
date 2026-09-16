import { Stack } from "@chakra-ui/react";
import type { ReactNode } from "react";

type StackerProps = {
  direction: "column" | "row";
  children: ReactNode;
  gap?: number;
};

const Stacker = ({ direction, children, gap }: StackerProps) => {
  return (
    <Stack direction={direction} w="full" gap={gap ? gap : 8} align="flex-start" >
      {children}
    </Stack >
  );
};

export default Stacker;

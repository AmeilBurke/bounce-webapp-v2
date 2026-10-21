import { Box, Heading, HStack, Skeleton, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";

type PageHeadingProps = {
  // Either is left undefined while its data is loading
  heading: string | undefined;
  subheading: string | undefined;
  // Shown in the accent colour before the heading, like a brand name
  accent?: string;
  // Shown on the right, such as a status pill
  aside?: ReactNode;
};

const PageHeading = ({ heading, subheading, accent, aside }: PageHeadingProps) => {
  return (
    <HStack w="full" justify="space-between" align="flex-start" gap={4} wrap="wrap">
      <Box minW={0}>
        {heading === undefined ? (
          <Skeleton h={['9', null, null, '10']} w="60" />
        ) : (
          <Heading
            fontSize={['3xl', null, null, '4xl']}
            fontWeight="bold"
            letterSpacing="-0.02em"
            lineHeight="shorter"
            overflowWrap="anywhere"
          >
            {accent && (
              <Box as="span" color="accent">
                {accent}{" "}
              </Box>
            )}
            {heading}
          </Heading>
        )}
        {subheading === undefined ? (
          <Skeleton h="5" w="72" maxW="full" mt={2} />
        ) : (
          <Text color="fg.muted" mt={2}>
            {subheading}
          </Text>
        )}
      </Box>
      {aside}
    </HStack>
  );
};

export default PageHeading;

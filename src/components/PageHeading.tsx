import { Heading, Skeleton, Text } from "@chakra-ui/react";
import Stacker from "./Stacker";

type PageHeadingProps = {
  // Either is left undefined while its data is loading
  heading: string | undefined;
  subheading: string | undefined;
};

const PageHeading = ({ heading, subheading }: PageHeadingProps) => {
  return (
    <Stacker direction={"column"} gap={4}>
      {heading === undefined ? (
        <Skeleton h={['9', null, null, '12']} w="60" />
      ) : (
        <Heading fontSize={['3xl', null, null, '5xl']} fontWeight={'bold'} textTransform='capitalize'>{heading}</Heading>
      )}
      {subheading === undefined ? (
        <Skeleton h="5" w="72" maxW="full" />
      ) : (
        <Text color={"#555555"} >{subheading}</Text>
      )}
    </Stacker>
  );
};

export default PageHeading;

import { Heading, Text } from "@chakra-ui/react";
import Stacker from "./Stacker";

type PageHeadingProps = {
  heading: string;
  subheading: string;
};

const PageHeading = ({ heading, subheading }: PageHeadingProps) => {
  return (
    <Stacker direction={"column"} gap={4}>
      <Heading fontSize={['3xl', null, null, '5xl']} fontWeight={'bold'} textTransform='capitalize'>{heading}</Heading>
      <Text color={"#555555"} >{subheading}</Text>
    </Stacker>
  );
};

export default PageHeading;

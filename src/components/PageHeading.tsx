import { Heading, Text } from "@chakra-ui/react";
import Stacker from "./Stacker";

type PageHeadingProps = {
  heading: string;
  subheading: string;
};

const PageHeading = ({ heading, subheading }: PageHeadingProps) => {
  return (
    <Stacker direction={"column"} gap={1}>
      <Heading>{heading}</Heading>
      <Text>{subheading}</Text>
    </Stacker>
  );
};

export default PageHeading;

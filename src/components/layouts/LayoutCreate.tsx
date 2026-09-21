import type { ReactNode } from "react";
import PageContainer from "../PageContainer";
import PageHeading from "../PageHeading";
import Stacker from "../Stacker";
import { HStack, IconButton, Image } from "@chakra-ui/react";
import { TfiAngleLeft } from "react-icons/tfi";
import ReturnButton from "../ReturnButton";

type LayoutCreateProps = {
    heading: string;
    subheading: string;
    children: ReactNode;
    imagePath?: string;
    returnArrow?: boolean;
};
// need to finish styling for no image page
const LayoutCreate = ({
    heading,
    subheading,
    children,
    imagePath,
    returnArrow,
}: LayoutCreateProps) => {
    if (imagePath) {
        return (
            <HStack>
                <Stacker direction="column" padding={[8, null, null, 16]}>
                    {returnArrow && <ReturnButton />}
                    <PageHeading heading={heading} subheading={subheading} />
                    {children}
                </Stacker>
                {imagePath ? (
                    <Image hideBelow="md" h="100%" maxH="100dvh" src={imagePath} />
                ) : null}
            </HStack>
        );
    } else {
        return (
            <PageContainer>
                <Stacker direction="column">
                    {returnArrow && <ReturnButton />}
                    <PageHeading heading={heading} subheading={subheading} />
                    {children}
                </Stacker>
            </PageContainer>
        );
    }
};

export default LayoutCreate;

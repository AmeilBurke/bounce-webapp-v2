import type { ReactNode } from "react";
import PageContainer from "../PageContainer";
import PageHeading from "../PageHeading";
import Stacker from "../Stacker";
import { Box, HStack, Image } from "@chakra-ui/react";
import ReturnButton from "../ReturnButton";

type LayoutCreateProps = {
    heading: string | undefined;
    subheading: string | undefined;
    children: ReactNode;
    imagePath?: string;
    returnArrow?: boolean;
};
// Shown on phones in place of the side image so they never download it
const BLANK_IMAGE = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

// The back button sits near the top edge, like a navigation bar
const RETURN_ARROW_TOP_PADDING = [2, null, null, 4];

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
                <Stacker
                    direction="column"
                    padding={[8, null, null, 16]}
                    paddingTop={returnArrow ? RETURN_ARROW_TOP_PADDING : undefined}
                >
                    {returnArrow && <ReturnButton />}
                    <PageHeading heading={heading} subheading={subheading} />
                    {children}
                </Stacker>
                {imagePath ? (
                    // display: contents keeps the image itself as the row's item, so it can't be squashed
                    <Box asChild display="contents">
                        <picture>
                            {/* 48em matches the md breakpoint that hides it */}
                            <source media="(min-width: 48em)" srcSet={imagePath} />
                            <Image
                                hideBelow="md"
                                // Fills the screen height whatever the image's own size
                                h="100dvh"
                                flexShrink={0}
                                src={BLANK_IMAGE}
                                alt=""
                            />
                        </picture>
                    </Box>
                ) : null}
            </HStack>
        );
    } else {
        return (
            <PageContainer props={returnArrow ? { pt: RETURN_ARROW_TOP_PADDING } : undefined}>
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

import {
    Dialog as ChakraDialog,
    Portal,
    CloseButton,
} from "@chakra-ui/react";
import type { ReactElement } from "react";

type DialogProps = {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    title: string;
    body: ReactElement;
    footer: ReactElement;
};

const Dialog = ({ isOpen, setIsOpen, title, body, footer }: DialogProps) => {
    return (
        <ChakraDialog.Root
            open={isOpen}
            onOpenChange={(e) => setIsOpen(e.open)}
            role="alertdialog"
            placement="center"
            closeOnEscape
            closeOnInteractOutside
        >
            <Portal>
                <ChakraDialog.Backdrop />
                <ChakraDialog.Positioner>
                    <ChakraDialog.Content>
                        <ChakraDialog.Header>
                            <ChakraDialog.Title>{title}</ChakraDialog.Title>
                        </ChakraDialog.Header>
                        <ChakraDialog.Body>{body}</ChakraDialog.Body>
                        <ChakraDialog.Footer>
                            {footer}
                        </ChakraDialog.Footer>
                        <ChakraDialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </ChakraDialog.CloseTrigger>
                    </ChakraDialog.Content>
                </ChakraDialog.Positioner>
            </Portal>
        </ChakraDialog.Root>
    );
};

export default Dialog;

import { Button, Center, Heading, Icon, Text } from "@chakra-ui/react"
import { LuTriangleAlert } from "react-icons/lu"
import { useRouter } from "@tanstack/react-router"
import Panel from "./Panel"

const ErrorPage = () => {
    const router = useRouter();

    return (
        <Center minH="100dvh" p={4}>
            <Panel p={8} maxW="md" w="full" textAlign="center">
                <Icon as={LuTriangleAlert} boxSize={8} color="red.fg" />
                <Heading size="xl" letterSpacing="-0.02em" mt={3}>
                    Something went wrong
                </Heading>
                <Text color="fg.muted" mt={1}>
                    An unexpected error has occurred
                </Text>
                <Button mt={6} onClick={() => router.navigate({ to: "/" })}>
                    Go Home
                </Button>
            </Panel>
        </Center>
    )
}

export default ErrorPage

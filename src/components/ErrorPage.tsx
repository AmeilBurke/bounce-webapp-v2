import { Button, Center } from "@chakra-ui/react"
import PageHeading from "./PageHeading"
import { useRouter } from "@tanstack/react-router"

const ErrorPage = () => {
    const router = useRouter();

    return (
        <Center mx="auto" p={8} maxW="3xl" h="100dvh" >
            <PageHeading heading="Error" subheading="An unexpected error has occured" />
            <Button onClick={() => router.navigate({ to: "/" })}>Go Home</Button>
        </Center>
    )
}

export default ErrorPage
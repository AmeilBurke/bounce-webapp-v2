import PageContainer from '../components/PageContainer'
import { Heading } from '@chakra-ui/react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
    component: Index,
})

function Index() {
    return (
        <PageContainer>
            <Heading>Index Page</Heading>
        </PageContainer>
    )
}
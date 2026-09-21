import { Container, type ContainerProps } from "@chakra-ui/react"
import type { ReactElement } from "react"

type PageContainerProps = {
  children: ReactElement;
  props?: ContainerProps;
}

const PageContainer = ({ children, props }: PageContainerProps) => {
  return (
    <Container minH={'100dvh'} w="full" maxW={'100vw'} p={[4, null, null, 16]} {...props}>
      {children}
    </Container>
  )
}

export default PageContainer
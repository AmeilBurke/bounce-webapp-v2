import { Container, type ContainerProps } from "@chakra-ui/react"
import type { ReactElement } from "react"

type PageContainerProps = {
  children: ReactElement;
  props?: ContainerProps;
}

// Centred with a max width so cards don't stretch across very wide screens
const PageContainer = ({ children, props }: PageContainerProps) => {
  return (
    <Container minH={'100dvh'} w="full" maxW={'7xl'} px={[4, null, null, 8]} py={[6, null, null, 12]} {...props}>
      {children}
    </Container>
  )
}

export default PageContainer

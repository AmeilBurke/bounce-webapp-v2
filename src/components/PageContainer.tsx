import { Container, type ContainerProps } from "@chakra-ui/react"
import type { ReactElement } from "react"

type PageContainerProps = {
  children: ReactElement;
  props?: ContainerProps;
}

const PageContainer = ({ children, props }: PageContainerProps) => {
  return (
    <Container p={8} {...props} >
      {children}
    </Container>
  )
}

export default PageContainer
import type { ReactNode } from 'react';
import PageContainer from '../PageContainer'
import PageHeading from '../PageHeading'
import Stacker from '../Stacker'

type LayoutCreateProps = {
    heading: string;
    subheading: string;
    children: ReactNode;
}


const LayoutCreate = ({ heading, subheading, children }: LayoutCreateProps) => {
    return (
        <PageContainer>
            <Stacker direction='column'>
                <PageHeading heading={heading} subheading={subheading} />
                {children}
            </Stacker>
        </PageContainer>
    )
}

export default LayoutCreate
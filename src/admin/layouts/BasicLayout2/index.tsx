import { ReactElement, ReactNode } from 'react';
import BasicHeader from './BasicHeader';

export type BasicLayoutProps = {
    children: ReactElement | ReactNode | null;
};

const BasicLayout = ({ children }: BasicLayoutProps) => (
    <div>
        <BasicHeader />
        <div>{children}</div>
    </div>
);

export default BasicLayout;

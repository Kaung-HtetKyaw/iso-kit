import { ReactElement } from 'react';
// import BasicLayout from '../layouts/BasicLayout';
import BasicLayout from '../layouts/BasicLayout2';
import HomePage from '../pages/HomePage';

const HomeRoute = (): ReactElement => (
    <BasicLayout>
        <HomePage />
    </BasicLayout>
);

export default HomeRoute;

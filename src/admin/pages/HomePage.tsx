import { Card } from 'antd';
import { useSelector } from 'react-redux';
import LatestTopics from '../components/LatestTopics';
import WelcomeAlert from '../components/WelcomeAlert';
import { withErrorBoundary } from '../layouts/RoutedErrorBoundary';
import { getDummy } from '../selectors/dummy';

const HomePage = () => {
    const dummy = useSelector(getDummy);

    return (
        <>
            <h1>{dummy}</h1>
            <WelcomeAlert />
            <Card>
                <LatestTopics />
            </Card>
        </>
    );
};

export default withErrorBoundary(HomePage);

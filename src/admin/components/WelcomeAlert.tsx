import { Alert } from 'antd';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { getUser } from '../selectors/context';

const StyledAlert = styled(Alert)`
    margin-bottom: ${props => props.theme.verticalSpacing};
`;

const WelcomeAlert = () => {
    const { t } = useTranslation(['common']);
    const user = useSelector(getUser);
    const welcomeTitle = `${t('common:welcomeTitleAdmin')} ${user ? user.displayName : ''}`;

    return <StyledAlert description={t('common:welcome')} message={welcomeTitle} type="info" showIcon />;
};

export default WelcomeAlert;

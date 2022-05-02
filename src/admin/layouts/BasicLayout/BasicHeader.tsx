import { LoginOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthenticateMutation } from '../../api';
import { setAuthenticationToken } from '../../reducers/authentication';
import { setUser } from '../../reducers/context';
import { useAppDispatch } from '../../store';
import HeaderLogo from './HeaderLogo';
import HeaderMenu from './HeaderMenu';
import { Header, HeaderContainer, MenuFiller } from './styled';

const BasicHeader = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const [authenticate] = useAuthenticateMutation({
        variables: { username: 'kg', password: 'KG_Sama02749' },
    });

    useEffect(() => {
        authenticate().then(res => {
            const { token, user } = res.data.authenticate;
            dispatch(setAuthenticationToken(token));
            dispatch(setUser(user));
        });
    }, []);

    return (
        <Header>
            <HeaderContainer>
                <HeaderLogo />
                <HeaderMenu />
                <MenuFiller />
                <Button icon={<LoginOutlined />} type="dashed">
                    {t('common:signIn')}
                </Button>
                <Button type="primary">{t('common:signUp')}</Button>
            </HeaderContainer>
        </Header>
    );
};

export default BasicHeader;

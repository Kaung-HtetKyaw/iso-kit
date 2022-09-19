import { LockIcon } from '@chakra-ui/icons';
import { Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import usePublic from '../../utilities/usePublic';
import HeaderMenu from './HeaderMenu';
import { Header, HeaderContainer } from './styled';

const LogoContainer = styled.div`
    flex: 0 0 auto;

    a,
    a:hover,
    a:focus {
        color: ${props => props.theme.antd['heading-color']};
        font-size: 1.25em;
        text-decoration: none;
        line-height: inherit;
    }

    img {
        height: 32px;
        margin-right: 16px;
        top: -1.5px;
    }
`;

const LogoLink = styled(Link)`
    display: flex;
    flex-direction: row;
`;

const HeaderLogo = () => {
    const logo = usePublic('logo.svg');

    return (
        <LogoContainer>
            <LogoLink to="/">
                <img alt="" src={logo} />
                <span>Next Starter</span>
            </LogoLink>
        </LogoContainer>
    );
};

const SignInButton = styled(Button)`
    flex: 1 1;
`;

const BasicHeader = () => (
    <Header>
        <HeaderContainer>
            <HeaderLogo />
            <HeaderMenu />
            <div>
                <SignInButton colorScheme="teal" leftIcon={<LockIcon />} variant="solid">
                    Sign in
                </SignInButton>
            </div>
        </HeaderContainer>
    </Header>
);

export default BasicHeader;

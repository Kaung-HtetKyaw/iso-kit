import styled from 'styled-components';

export const Header = styled.div`
    /* position: fixed; */
    width: 100%;
    margin: 0;
    padding: 0;
    top: 0;
    left: 0;
`;

export const HeaderContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex: 1 1 auto;
    justify-content: space-between;
    align-items: center;
    height: 70px;
    background-color: white;
    padding: ${props => props.theme.chakra['layout-header-padding']};
`;

import { ChevronDownIcon } from '@chakra-ui/icons';
import { Button, MenuButton, MenuList, Menu, Flex, MenuGroup, MenuItem } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

export type ItemMenu = { type: 'item'; key: string; label: string; href: string };

export type SubMenu = {
    type: 'subMenu';
    label: string;
    key: string;
    items: (ItemMenu | GroupMenu)[];
};

export type GroupMenu = {
    type: 'group';
    label: string;
    key: string;
    items: ItemMenu[];
};

const generateMenu = (): (ItemMenu | SubMenu | GroupMenu)[] => [
    {
        type: 'item',
        label: 'Home',
        href: '/',
        key: 'item:1',
    },
    { type: 'item', label: 'Topics', href: '/topics', key: 'item:2' },
    {
        type: 'subMenu',
        key: 'subMenu',
        label: '404/500 pages',
        items: [
            {
                key: 'group:1',
                type: 'group',
                label: 'Item 1',
                items: [
                    { key: 'settings:1', label: 'Error page', type: 'item', href: '/dummyError' },
                    { key: 'settings:2', label: 'Option 2', type: 'item', href: '/c' },
                ],
            },
            {
                key: 'group:2',
                type: 'group',
                label: 'Item 2',
                items: [
                    { key: 'settings:3', label: 'Option 3', type: 'item', href: '/d' },
                    { key: 'settings:4', label: 'Option 4', type: 'item', href: '/e' },
                ],
            },
        ],
    },
];

const MenuLink = styled(Link)`
    font-size: 15px;
    font-weight: bold;
    margin-right: 20px;
`;

const renderMenuItem = (item: ItemMenu | SubMenu | GroupMenu) => {
    switch (item.type) {
        case 'item':
            return (
                <MenuLink key={item.label} to={item.href}>
                    {item.label}
                </MenuLink>
            );

        case 'group':
            return (
                <MenuGroup key={item.label} title={item.label}>
                    {item.items.map(link => (
                        <MenuItem key={link.label} as="div">
                            {renderMenuItem(link)}
                        </MenuItem>
                    ))}
                </MenuGroup>
            );
        case 'subMenu':
            return (
                <Menu key={item.label}>
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                        {item.label}
                    </MenuButton>
                    <MenuList>
                        {item.items.map(link => (
                            <MenuItem key={link.label} as="div">
                                {renderMenuItem(link)}
                            </MenuItem>
                        ))}
                    </MenuList>
                </Menu>
            );
        default:
            return null;
    }
};

const Menus = () => {
    const menu = generateMenu();

    return <div>{menu.map(renderMenuItem)}</div>;
};

const HeaderMenu = styled(Menus)`
    flex: 1 1;
`;

export default HeaderMenu;

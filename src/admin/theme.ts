import antd from './antd-theme.json';

export type Theme = {
    readonly antd: typeof antd;

    readonly chakra: typeof antd;

    verticalSpacing: string;
};

const theme: Theme = {
    antd,
    chakra: antd,
    verticalSpacing: '20px',
};

export default theme;

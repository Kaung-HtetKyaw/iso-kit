import antd from './antd-theme.json';

export type Theme = {
    readonly antd: typeof antd;

    verticalSpacing: string;

    readonly chakra: typeof antd;
};

const theme: Theme = {
    antd,
    verticalSpacing: '20px',
    chakra: antd,
};

export default theme;

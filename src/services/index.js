import AxiosService from 'utilities/Axios';

const url = 'calculator';

export const authentication = (mbToken) => {
    return AxiosService.post(`/${url}/authentication/login`, {
        mbToken,
    });
};

export const getListAccount = () => {
    return AxiosService.get(`/${url}/account/default`);
};

export const changeAccount = ({ account, customerCif }) => {
    return AxiosService.post(`/${url}/account/default`, {
        account,
        customerCif,
    });
};

export const createBill = ({ money }) => {
    return AxiosService.post(`/${url}/bill/add`, { money });
};

export const getBillHistory = ({ page, size }) => {
    return AxiosService.get(`/${url}/bill/history`, {
        params: {
            page,
            size,
        },
    });
};

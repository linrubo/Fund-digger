import request from '../utils/request.js';
import { buildURL } from '../utils/api.js';

const BASE_URL = 'https://fundf10.eastmoney.com/FundArchivesDatas.aspx';
const DEFAULT_PERCENTAGE = '0.00%';

const parse = function (response) {
    const result = {};
    const types = ['机构持有', '个人持有', '内部持有'];
    const values = response.match(/\b([\d\.]+%)/g) ?? [];

    types.forEach((type, index) => {
        result[type] = values[index] ?? DEFAULT_PERCENTAGE;
    });

    return result;
};

const getHolderStructure = async function (code) {
    const params = {
        type: 'cyrjg',
        code: code,
        rt: Math.random()
    };
    const url = buildURL(BASE_URL, params);
    const referer = `https://fundf10.eastmoney.com/cyrjg_${code}.html`;
    const response = await request(url, referer);
    const result = parse(response);

    return result;
};

export { getHolderStructure };
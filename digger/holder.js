import request from '../lib/request.js';

const DEFAULT_PERCENTAGE = '0.00%';

const buildURL = function (code) {
    const referer = `https://fundf10.eastmoney.com/cyrjg_${code}.html`;
    const url = new URL('https://fundf10.eastmoney.com/FundArchivesDatas.aspx');

    url.searchParams.set('type', 'cyrjg');
    url.searchParams.set('code', code);
    url.searchParams.set('rt', Math.random());

    return { url, referer };
};

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
    const { url, referer } = buildURL(code);
    const response = await request(url, referer);
    const result = parse(response);

    return result;
};

export default getHolderStructure;
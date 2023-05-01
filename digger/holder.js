import request from '../lib/request.js';

const holder = async function (code) {
    const referer = `https://fundf10.eastmoney.com/cyrjg_${code}.html`;
    const url = new URL('https://fundf10.eastmoney.com/FundArchivesDatas.aspx');

    url.searchParams.set('type', 'cyrjg');
    url.searchParams.set('code', code);
    url.searchParams.set('rt', Math.random());

    const response = await request.get(url, referer);

    const result = {};
    const keys = ['机构持有', '个人持有', '内部持有'];
    const values = response.match(/([\d\.]+%)/g) ?? [];

    keys.forEach((key, index) => result[key] = values[index] ?? '0.00%');

    return result;
};

export default holder;
import request from '../lib/request.js';

const NO_DATA_PLACEHOLDER = '---';

const buildURL = function (code) {
    const referer = `https://fundf10.eastmoney.com/jdzf_${code}.html`;
    const url = new URL('https://fundf10.eastmoney.com/FundArchivesDatas.aspx');

    url.searchParams.set('type', 'jdzf');
    url.searchParams.set('code', code);
    url.searchParams.set('rt', Math.random());

    return { url, referer };
};

const parse = function (response) {
    const result = {};
    const pattern = /<li class='title'>(\S+)<\/li><li [^>]+>([\-\d\.]+%|\-+)<\/li>/g;
    let matched = pattern.exec(response);

    while (matched) {
        const [full, title, value] = matched;

        if (value !== NO_DATA_PLACEHOLDER) {
            result[title] = value;
        }

        matched = pattern.exec(response);
    }

    return result;
};

const getStageReturns = async function (code) {
    const { url, referer } = buildURL(code);
    const response = await request(url, referer);
    const result = parse(response);

    return result;
};

export default getStageReturns;
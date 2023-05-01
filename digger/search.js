import morningstar from '../data/morningstar.js';
import request from '../lib/request.js';

const adapter = function (list) {
    return list.map(item => {
        return {
            code: item.CODE,
            name: item.NAME
        };
    });
};

const filter = function (list, tags = [], expected = true) {
    const ETF_NAME_PATTERN = /(\u0028QDII\-)?ETF(\u0029|\u0028QDII\u0029)?$/;
    const ETF_CODE_PATTERN = /^(159|51[0-35-8]|56[0-3]|588)/;
    const LOF_CODE_PATTERN = /^(16|501|506)/;

    return list.filter(({ code, name }) => {
        return tags.every(tag => {
            let state;

            switch (tag) {
                case '场内':
                    state = ETF_NAME_PATTERN.test(name) || LOF_CODE_PATTERN.test(code);
                    break;
                case '场外':
                    state = !ETF_NAME_PATTERN.test(name);
                    break;
                case 'ETF':
                    state = ETF_NAME_PATTERN.test(name);
                    break;
                case 'LOF':
                    state = LOF_CODE_PATTERN.test(code);
                    break;
                case 'A':
                    state = /A(?:\/B)?$/.test(name);
                    break;
                case 'C':
                    state = /C$/.test(name);
                    break;
                default:
                    state = name.includes(tag);
            }

            return state === expected;
        });
    });
};

const getPageSize = async function (keyword) {
    const url = new URL('https://fundsuggest.eastmoney.com/FundSearch/api/FundSearchPageAPI.ashx');

    url.searchParams.set('m', 0);
    url.searchParams.set('key', keyword);
    url.searchParams.set('_', Date.now());

    const response = await request.get(url);

    const data = JSON.parse(response)?.Datas ?? {};

    return data.FundListTotalCount ?? 0;
};

const search = async function (keyword, options = { exclude: [] }) {
    let result;

    if (options.morningstar) {
        result = morningstar[keyword] ?? [];
    } else {
        const pagesize = await getPageSize(keyword);
        const url = new URL('https://fundsuggest.eastmoney.com/FundSearch/api/FundSearchPageAPI.ashx');

        url.searchParams.set('m', 1);
        url.searchParams.set('key', keyword);
        url.searchParams.set('pageindex', 0);
        url.searchParams.set('pagesize', pagesize);
        url.searchParams.set('_', Date.now());

        const response = await request.get(url);

        const data = JSON.parse(response)?.Datas ?? [];
        result = adapter(data);
    }

    result = filter(result, ['后端', ...options.exclude], false);
    result = filter(result, options.filter);

    return result;
};

export default search;
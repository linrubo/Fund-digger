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

const paging = async function (keyword, pageindex) {
    const url = new URL('https://fundsuggest.eastmoney.com/FundSearch/api/FundSearchPageAPI.ashx');

    url.searchParams.set('m', 1);
    url.searchParams.set('key', keyword);
    url.searchParams.set('pageindex', pageindex);
    url.searchParams.set('pagesize', 1000);
    url.searchParams.set('_', Date.now());

    const response = await request.get(url);

    const result = JSON.parse(response)?.Datas ?? [];

    return result;
};

const eastmoney = async function (keyword) {
    const cache = [];
    let pageindex = 0;

    while (true) {
        const item = await paging(keyword, pageindex);

        if (item.length === 0) {
            break;
        }

        cache.push(...item);
        pageindex += 1;
    }

    return adapter(cache);
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
                    state = /A(\/B|\W+)?$/.test(name);
                    break;
                case 'B':
                    state = /[^\/]B$/.test(name);
                    break;
                case 'C':
                    state = /C(\W+)?$/.test(name);
                    break;
                case 'D':
                    state = /D(\W+)?$/.test(name);
                    break;
                case 'E':
                    state = /E(\W+)?$/.test(name);
                    break;
                case 'I':
                    state = /I(\W+)?$/.test(name);
                    break;
                case 'Y':
                    state = /Y(\W+)?$/.test(name);
                    break;
                default:
                    state = name.includes(tag);
            }

            return state === expected;
        });
    });
};

const search = async function (keyword, options = { exclude: [] }) {
    let result;

    if (options.morningstar) {
        result = morningstar[keyword] ?? [];
    } else {
        result = await eastmoney(keyword);
    }

    result = filter(result, ['后端', ...options.exclude], false);
    result = filter(result, options.filter);

    return result;
};

export default search;
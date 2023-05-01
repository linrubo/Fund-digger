import request from '../utils/request.js';
import { buildURL } from '../utils/api.js';

const BASE_URL = 'https://fundf10.eastmoney.com/FundArchivesDatas.aspx';
const NO_DATA_PLACEHOLDER = '---';

const parseQuarterlyReturns = function (response) {
    const values = response.match(/([\-\d\.]+%|\-+)(?=<\/td>)/g) ?? [];
    const years = response.match(/\d+(?=年)/g) ?? [];
    const length = values.length;
    const result = [];

    for (let index = 0; index < length; index += 4) {
        const year = years.shift();
        const fragment = values.slice(index, index + 4);

        while (fragment.length) {
            const quarter = fragment.length;
            const value = fragment.pop();

            if (value !== NO_DATA_PLACEHOLDER) {
                result.push([`${year}Q${quarter}`, value]);
            }
        }
    }

    return result;
};

const parseAnnualReturns = function (response) {
    const values = response.match(/([\-\d\.]+%|\-+)(?=<\/td>)/g);
    const years = response.match(/\d+(?=年)/g) ?? [];
    const result = [];

    years.forEach((year, index) => {
        const value = values[index];
        if (value !== NO_DATA_PLACEHOLDER) {
            result.push([year, value]);
        }
    });

    return result;
};

const getAnnualReturns = async function (code, options = {}) {
    const params = {
        type: 'yearzf',
        code: code,
        rt: Math.random()
    };
    const url = buildURL(BASE_URL, params);
    const referer = `https://fundf10.eastmoney.com/jndzf_${code}.html`;
    const response = await request(url, referer);
    const result = parseAnnualReturns(response);

    if (options.reverse) {
        result.reverse();
    }

    return result;
};

export { getAnnualReturns };
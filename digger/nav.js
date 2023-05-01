import request from '../lib/request.js';

const filter = function (list, interval) {
    const result = [];
    let previous = {};

    list.forEach(([date, value]) => {
        const [year, month] = date.split('-');
        const current = { year, month };

        if (previous[interval] !== current[interval]) {
            result.push([date, value]);
        }

        previous = current;
    });

    return result;
};

const format = function (list, cumulative) {
    return list.map(({ FSRQ, DWJZ, LJJZ, JZZZL }) => {
        if (cumulative) {
            return [FSRQ, LJJZ];
        } else {
            return [FSRQ, DWJZ, `${JZZZL}%`];
        }
    });
};

const getPagedData = async function (code, index, start, end) {
    const referer = 'https://fundf10.eastmoney.com/';
    const url = new URL('https://api.fund.eastmoney.com/f10/lsjz');

    url.searchParams.set('fundCode', code);
    url.searchParams.set('pageIndex', index);
    url.searchParams.set('pageSize', 20);
    url.searchParams.set('startDate', start ?? '');
    url.searchParams.set('endDate', end ?? '');
    url.searchParams.set('_', Date.now());

    const response = await request(url, referer);

    return JSON.parse(response)?.Data?.LSJZList ?? [];
};

const getPagesData = async function (code, start, end) {
    const result = [];
    const limit = start === undefined ? 1 : Infinity;
    let index = 1;

    while (index <= limit) {
        const data = await getPagedData(code, index, start, end);

        if (data.length === 0) {
            break;
        } else {
            result.push(...data);
            index += 1;
        }
    }

    return result;
};

const getNetAssetValue = async function (code, options = {}) {
    const { start, end, cumulative, interval } = options;
    let result = await getPagesData(code, start, end);

    result = format(result, cumulative);

    if (/(month|year)/.test(interval)) {
        result = filter(result, interval);
    }
    if (options.reverse) {
        result.reverse();
    }

    return result;
};

export default getNetAssetValue;
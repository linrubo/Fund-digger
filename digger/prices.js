import request from '../lib/request.js';

const today = new Date().toLocaleDateString();
const counter = function (start, end = today) {
    let result = 20;

    if (start) {
        start = new Date(start);
        end = new Date(end);
        result = (end - start) / (24 * 60 * 60 * 1000);
    }

    return Math.round(result);
};

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

const prices = async function (code, options = {}) {
    const { start, end } = options;
    const url = new URL('https://api.fund.eastmoney.com/f10/lsjz');

    url.searchParams.set('fundCode', code);
    url.searchParams.set('pageIndex', 1);
    url.searchParams.set('pageSize', counter(start, end));
    url.searchParams.set('startDate', start ?? '');
    url.searchParams.set('endDate', end ?? '');
    url.searchParams.set('_', Date.now());

    const response = await request.get(url, 'https://fundf10.eastmoney.com/');

    const data = JSON.parse(response)?.Data?.LSJZList ?? [];
    let result = data.map(({ FSRQ, DWJZ, LJJZ, JZZZL }) => {
        if (options.cumulative) {
            return [FSRQ, LJJZ, `${JZZZL}%`];
        } else {
            return [FSRQ, DWJZ, `${JZZZL}%`];
        }
    });

    if (/(month|year)/.test(options.interval)) {
        result = filter(result, options.interval);
    }
    if (options.reverse) {
        result.reverse();
    }

    return result;
};

export default prices;
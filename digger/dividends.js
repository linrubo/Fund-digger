import request from '../lib/request.js';

const yearly = function (list) {
    const result = [];
    let previous;
    let accumulator = 0;

    list.forEach(([date, value], index) => {
        const [current] = date.split('-');

        if (index === 0 || previous === current) {
            accumulator += parseFloat(value);
        } else {
            result.push([previous, accumulator.toFixed(4)]);
            accumulator = parseFloat(value);
        }
        if (index === list.length - 1) {
            result.push([current, accumulator.toFixed(4)]);
        }

        previous = current;
    });

    return result;
};

const dividends = async function (code, options) {
    const url = `https://fundf10.eastmoney.com/fhsp_${code}.html`;
    const response = await request.get(url);

    const pattern = /<td>(?<date>[\d\-]{10})<\/td><td>每份派现金(?<value>\d\.\d{4})元<\/td>/g;
    let matched = pattern.exec(response);
    let result = [];

    while (matched) {
        const { date, value } = matched.groups;
        result.push([date, value]);
        matched = pattern.exec(response);
    }

    if (options.yearly) {
        result = yearly(result)
    }

    if (options.reverse) {
        result.reverse();
    }

    return result;
};

export default dividends;
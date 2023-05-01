import request from '../utils/request.js';

const aggregate = function (list) {
    const result = [];
    const lastIndex = list.length - 1;
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
        if (index === lastIndex) {
            result.push([current, accumulator.toFixed(4)]);
        }

        previous = current;
    });

    return result;
};

const parse = function (response) {
    const result = [];
    const pattern = /<td>([\d\-]{10})<\/td><td>每份派现金(\d\.\d{4})元<\/td>/g;
    let matched = pattern.exec(response);

    while (matched) {
        const [full, date, value] = matched;
        result.push([date, value]);
        matched = pattern.exec(response);
    }

    return result;
};

const getDividends = async function (code, options = {}) {
    const url = `https://fundf10.eastmoney.com/fhsp_${code}.html`;
    const response = await request(url);
    let result = parse(response);

    if (options.yearly) {
        result = aggregate(result);
    }
    if (options.reverse) {
        result.reverse();
    }

    return result;
};

export { getDividends };
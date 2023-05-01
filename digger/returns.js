import request from '../lib/request.js';

const yearly = function (response) {
    const values = response.match(/([\-\d\.]+%|\-+)(?=<\/td>)/g);
    const years = response.match(/\d+(?=年)/g) ?? [];
    const result = [];

    years.forEach((year, index) => {
        const value = values[index];
        if (value !== '---') {
            result.push([year, value]);
        }
    });

    return result;
};

const quarterly = function (response) {
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

            if (value !== '---') {
                result.push([`${year}Q${quarter}`, value]);
            }
        }
    }

    return result;
};

const returns = async function (code, options = {}) {
    const referer = `https://fundf10.eastmoney.com/jndzf_${code}.html`;
    const url = new URL('https://fundf10.eastmoney.com/FundArchivesDatas.aspx');
    const types = {
        year: 'yearzf',
        quarter: 'jdndzf'
    };

    url.searchParams.set('type', types[options.type] ?? 'yearzf');
    url.searchParams.set('code', code);
    url.searchParams.set('rt', Math.random());

    const response = await request(url, referer);

    let result;
    if (options.type === 'quarter') {
        result = quarterly(response);
    } else {
        result = yearly(response);
    }

    if (options.reverse) {
        result.reverse();
    }

    return result;
};

export default returns;
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

const stages = function (response) {
    const result = [];
    const pattern = /<li class='title'>(?<title>\S+?)<\/li><li [^>]+>(?<value>[\-\d\.]+%|\-+)<\/li>/g
    let matched = pattern.exec(response);

    while (matched) {
        const { title, value } = matched.groups;

        if (value !== '---') {
            result.push([title, value]);
        }

        matched = pattern.exec(response);
    }

    return result;
};

const returns = async function (code, options) {
    const referer = `https://fundf10.eastmoney.com/jndzf_${code}.html`;
    const url = new URL('https://fundf10.eastmoney.com/FundArchivesDatas.aspx');
    const types = {
        year: 'yearzf',
        quarter: 'jdndzf',
        stage: 'jdzf'
    };

    url.searchParams.set('type', types[options.type] ?? 'yearzf');
    url.searchParams.set('code', code);
    url.searchParams.set('rt', Math.random());

    const response = await request.get(url, referer);

    let result;
    switch (options.type) {
        case 'quarter':
            result = quarterly(response);
            break;
        case 'stage':
            result = stages(response);
            break;
        default:
            result = yearly(response);
    }

    if (options.reverse) {
        result.reverse();
    }

    return result;
};

export default returns;
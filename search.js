import https from 'https';

import { HEADERS, TIMEOUT, RETRY_LIMIT } from './config.js';

const adapter = function (datas = []) {
    return datas.map(item => {
        return {
            code: item.CODE,
            name: item.NAME
        };
    });
};

const filter = function (datas = [], type = '') {
    datas = datas.filter(({ name }) => !name.includes('后端'));

    return datas.filter(({ name }) => {
        let state;

        switch (type) {
        case '场内':
            state = /ETF(?:\(QDII\))?$/i.test(name);
            break;
        case '场外':
            state = !/ETF(?:\(QDII\))?$/i.test(name);
            break;
        default:
            state = name.includes(type);
        }

        return state;
    });
};

const retries = new Map();

const search = function (keyword, type) {
    return new Promise((resolve, reject) => {
        const url = new URL('https://fundsuggest.eastmoney.com/FundSearch/api/FundSearchPageAPI.ashx');
        url.searchParams.set('m', 1);
        url.searchParams.set('key', keyword);
        url.searchParams.set('pageindex', 0);
        url.searchParams.set('pagesize', Math.floor(Math.random() * 300 + 200));

        const options = {
            HEADERS
        };

        const request = https.get(url, options);

        request.setTimeout(TIMEOUT);
        request.on('error', reject);

        request.on('timeout', () => {
            const count = retries.get(keyword) ?? 0;

            request.destroy();

            if (count < RETRY_LIMIT) {
                resolve(search(...arguments));
            } else {
                resolve([]);
            }

            retries.set(keyword, count + 1);
        });

        request.on('response', response => {
            let body = '';

            response.setEncoding('utf8');
            response.on('data', chunk => body += chunk);
            response.on('end', () => {
                const data = JSON.parse(body)?.Datas;
                const result = filter(adapter(data), type);

                resolve(result);
            });
        });
    });
};

export default search;
import https from 'https';

import { HEADERS, TIMEOUT, RETRY_LIMIT } from './config.js';

const retries = new Map();

const holder = function ({ code }) {
    return new Promise((resolve, reject) => {
        const url = new URL('https://fundf10.eastmoney.com/FundArchivesDatas.aspx');
        url.searchParams.set('type', 'cyrjg');
        url.searchParams.set('code', code);
        url.searchParams.set('rt', Math.random());

        const options = {
            headers: HEADERS
        };

        const request = https.get(url, options);

        request.setTimeout(TIMEOUT);
        request.on('error', reject);

        request.on('timeout', () => {
            const count = retries.get(code) ?? 0;

            request.destroy();

            if (count < RETRY_LIMIT) {
                resolve(holder(...arguments));
            } else {
                resolve({});
            }

            retries.set(code, count + 1);
        });

        request.on('response', response => {
            let body = '';

            response.setEncoding('utf8');
            response.on('data', chunk => body += chunk);
            response.on('end', () => {
                const result = {};
                const keys = ['机构持有', '个人持有', '内部持有'];
                const values = body.match(/([\d\.]+%)/g) ?? [];

                keys.forEach((key, index) => result[key] = values[index] ?? '0.00%');

                resolve(result);
            });
        });
    });
};

export default holder;
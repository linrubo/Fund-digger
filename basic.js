import https from 'https';

import { HEADERS, TIMEOUT, RETRY_LIMIT } from './config.js';

const patterns = {
    '基金规模': /基金规模\D+([\d\.]+)亿/,
    '成立日期': /成\s*立\s*日\D+([\d\-]{10})<\/td>/,
    '跟踪误差': /跟踪误差\D+([\d\.]+%)<\/td>/,
    '近3年收益率': /近3年\D+([\d\.]+%)<\/span><\/dd>/
};

const retries = new Map();

const basic = function ({ code }) {
    return new Promise((resolve, reject) => {
        const url = `https://fund.eastmoney.com/${code}.html?spm=search`;
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
                resolve(basic(...arguments));
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

                Object.entries(patterns).forEach(([name, pattern]) => {
                    result[name] = body.match(pattern)?.[1] ?? '';
                });

                resolve(result);
            });
        });
    });
};

export default basic;
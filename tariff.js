import https from 'https';

import { HEADERS, TIMEOUT, RETRY_LIMIT } from './config.js';

const retries = new Map();

const tariff = function ({ code }) {
    return new Promise((resolve, reject) => {
        const url = `https://fundf10.eastmoney.com/jjfl_${code}.html`;
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
                resolve(tariff(...arguments));
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
                const purchase = body.match(/购买手续费\D+([\d\.]+%)\D*([\d\.]+%)?<\/b>/) ?? [];
                let operation = body.match(/([\d\.]+)(?=%\S每年\S)/g) ?? [];

                operation = operation.reduce((prev, current) => prev + current * 100, 0);

                result['申购费率'] = purchase[2] ?? purchase[1] ?? '';
                result['运作费率'] = `${(operation / 100).toFixed(2)}%`;

                resolve(result);
            });
        });
    });
};

export default tariff;
import https from 'node:https';
import { USER_AGENT, REFERER, TIMEOUT, RETRY_LIMIT } from '../config.js';

const retries = new Map();

const get = function (url, referer) {
    return new Promise((resolve, reject) => {
        const request = https.get(url, {
            headers: {
                'User-Agent': USER_AGENT,
                'Referer': referer ?? REFERER
            }
        });

        request.setTimeout(TIMEOUT);
        request.on('error', reject);

        request.on('timeout', () => {
            const count = retries.get(url) ?? 0;
            console.log(`retry ${count + 1} of ${url}`);

            request.destroy();

            if (count < RETRY_LIMIT) {
                resolve(get(url, referer));
            } else {
                resolve('');
            }

            retries.set(url, count + 1);
        });

        request.on('response', response => {
            let body = '';

            response.setEncoding('utf8');
            response.on('data', chunk => body += chunk);

            response.on('end', () => {
                resolve(body);
            });
        });
    });
};

export default {
    get
};
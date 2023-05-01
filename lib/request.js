const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36';
const DEFAULT_REFERER = 'https://fund.eastmoney.com/';
const TIMEOUT = 5 * 1000;
const RETRY_LIMIT = 5;

const retries = new Map();

const request = async function (url, referer) {
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': USER_AGENT,
                'Referer': referer ?? DEFAULT_REFERER
            },
            signal: AbortSignal.timeout(TIMEOUT)
        });
        const body = await response.text();
        return body;
    } catch (error) {
        const count = retries.get(url) ?? 0;
        console.log(`retry ${count + 1} of ${url}`);

        if (count < RETRY_LIMIT) {
            retries.set(url, count + 1);
            return request(url, referer);
        } else {
            return '';
        }
    }
};

export default request;
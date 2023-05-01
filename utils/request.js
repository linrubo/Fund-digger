const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36';
const DEFAULT_REFERER = 'https://fund.eastmoney.com/';
const TIMEOUT = 1000 * 5;
const RETRY_LIMIT = 5;
const DEFAULT_RESULT = '';

const counter = new Map();

const retry = function (url, referer) {
    const count = counter.get(url) ?? 0;

    if (count < RETRY_LIMIT) {
        console.log(`Retrying URL: ${url}, attempt: ${count + 1}`);
        counter.set(url, count + 1);
        return request(url, referer);
    } else {
        console.log(`Max retry limit reached for URL: ${url}`);
        counter.delete(url);
        return DEFAULT_RESULT;
    }
};

const request = async function (url, referer) {
    try {
        const response = await fetch(url, {
            headers: {
                'accept': '*/*',
                'accept-language': 'zh-CN,zh;q=0.9',
                'Referer': referer ?? DEFAULT_REFERER,
                'User-Agent': USER_AGENT,
            },
            signal: AbortSignal.timeout(TIMEOUT)
        });
        const result = await response.text();
        return result;
    } catch (error) {
        if (error.name === 'TimeoutError') {
            console.log(`Request timed out for URL: ${url}`);
            return retry(url, referer);
        } else {
            console.error(`Request failed for URL: ${url}`, error);
            return DEFAULT_RESULT;
        }
    }
};

export default request;
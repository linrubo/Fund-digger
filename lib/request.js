const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36';
const DEFAULT_REFERER = 'https://fund.eastmoney.com/';
const TIMEOUT = 1000 * 5;
const RETRY_LIMIT = 5;

const counter = new Map();

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
        const body = await response.text();
        return body;
    } catch (error) {
        const count = counter.get(url) ?? 0;
        console.log(`Request failed: ${url}, retry ${count + 1}`);

        if (count < RETRY_LIMIT) {
            counter.set(url, count + 1);
            return request(url, referer);
        } else {
            return '';
        }
    }
};

export default request;
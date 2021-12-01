const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36',
    'Referer': 'https://fund.eastmoney.com/',
};

const TIMEOUT = 5 * 1000;
const RETRY_LIMIT = 5;
// series | parallel
const MODE = 'series';
const QPS = 30;

export {
    HEADERS,
    TIMEOUT,
    RETRY_LIMIT,
    MODE,
    QPS
};
import request from '../lib/request.js';

const patterns = {
    '基金简称': /<title>(.+?)(?=\u0028\d{6}\u0029)/,
    '基金规模': /规模\D+([\d\.]+)亿/,
    '成立日期': /成\s*立\s*日\D+([\d\-]{10})<\/td>/,
    '跟踪误差': /跟踪误差\D+([\d\.]+%)<\/td>/,
    '分红次数': /总计分红[^>]+>\s*(\d+)<\/a>/,
    '近1年': /近1年\S(?:<\/?span[^>]*>){2}(\-?[\d\.]+%)/,
    '近3年': /近3年\S(?:<\/?span[^>]*>){2}(\-?[\d\.]+%)/,
};

const basic = async function (code) {
    const url = `https://fund.eastmoney.com/${code}.html?spm=search`;
    const response = await request.get(url);
    const result = {};

    Object.entries(patterns).forEach(([name, pattern]) => {
        result[name] = response.match(pattern)?.[1] ?? '';
    });

    return result;
};

export default basic;
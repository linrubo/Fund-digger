import request from '../lib/request.js';

const stages = async function (code) {
    const referer = `https://fundf10.eastmoney.com/jdzf_${code}.html`;
    const url = new URL('https://fundf10.eastmoney.com/FundArchivesDatas.aspx');

    url.searchParams.set('type', 'jdzf');
    url.searchParams.set('code', code);
    url.searchParams.set('rt', Math.random());

    const response = await request(url, referer);

    const result = {};
    const pattern = /<li class='title'>(?<title>\S+?)<\/li><li [^>]+>(?<value>[\-\d\.]+%|\-+)<\/li>/g;
    let matched = pattern.exec(response);

    while (matched) {
        const { title, value } = matched.groups;

        if (value !== '---') {
            result[title] = value;
        }

        matched = pattern.exec(response);
    }

    return result;
};

export default stages;
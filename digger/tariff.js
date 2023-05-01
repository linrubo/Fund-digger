import request from '../lib/request.js';

const tariff = async function (code) {
    const url = `https://fundf10.eastmoney.com/jjfl_${code}.html`;
    const response = await request.get(url);

    const result = {};
    const keys = ['管理费率', '托管费率', '销售费率'];
    const purchase = response.match(/购买手续费\D+([\d\.]+%)\D*([\d\.]+%)?<\/b>/) ?? [];
    const operations = response.match(/([\d\.]+%)(?=\uff08每年\uff09)/g) ?? [];
    const total = operations.reduce((accumulator, item) => {
        return accumulator + parseFloat(item) * 100;
    }, 0);

    result['申购费率'] = purchase[2] ?? purchase[1] ?? '';
    result['运作费率'] = `${(total / 100).toFixed(2)}%`;
    keys.forEach((key, index) => result[key] = operations[index] ?? '');

    return result;
};

export default tariff;
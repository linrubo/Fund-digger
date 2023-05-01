import search from './digger/search.js';
import getDetails from './digger/details.js';

const titles = [
    '基金代码', '基金简称', '基金规模', '成立日期', '跟踪误差', '分红次数',
    '今年来', '近1年', '近3年', '近5年',
    '申购费率', '运作费率',
    '机构持有', '个人持有', '内部持有',
];

const dig = async function (keyword, options) {
    const list = await search(keyword, options);
    const total = list.length;
    const result = [titles];

    // To ensure order, do not use the forEach method
    for (let index = 0; index < total; index += 1) {
        const { code, name } = list[index];
        const data = await getDetails(code);
        const row = [code, ...titles.slice(1).map(key => data[key])];

        result.push(row);
        options.hook?.({ index, total, code, name });
    }

    return result;
};

export {
    dig,
    search,
    getDetails
}
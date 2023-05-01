import search from './digger/search.js';
import basic from './digger/basic.js';
import stages from './digger/stages.js';
import fees from './digger/fees.js';
import holder from './digger/holder.js';
import prices from './digger/prices.js';
import returns from './digger/returns.js';

const combo = [basic, stages, fees, holder];

const titles = [
    '基金代码', '基金简称', '基金规模', '成立日期', '跟踪误差', '分红次数',
    '今年来', '近1年', '近3年', '近5年',
    '申购费率', '运作费率',
    '机构持有', '个人持有', '内部持有',
];

const detail = async function (code) {
    const promises = combo.map(handle => handle(code));
    const groups = await Promise.all(promises);
    const result = Object.assign({}, ...groups);

    return result;
};

const dig = async function (keyword, options) {
    const list = await search(keyword, options);
    const total = list.length;
    const result = [titles];

    // To ensure order, do not use the forEach method
    for (let index = 0; index < total; index += 1) {
        const { code, name } = list[index];
        const data = await detail(code);
        const row = [code, ...titles.slice(1).map(key => data[key])];
        const progress = `${index + 1}`.padStart(`${total}`.length, '0');

        result.push(row);
        console.log(`${progress}/${total} ${code}:${name} 处理完成`);
    }

    return result;
};

export {
    dig,
    search,
    detail,
    prices,
    returns
}
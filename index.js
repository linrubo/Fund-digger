import basic from "./digger/basic.js";
import holder from "./digger/holder.js";
import tariff from "./digger/tariff.js";
import search from './digger/search.js';

const diggers = [basic, tariff, holder];

const titles = [
    '基金代码', '基金简称',
    '基金规模', '成立日期', '跟踪误差', '分红次数', '近1年', '近3年',
    '申购费率', '运作费率',
    '机构持有', '个人持有', '内部持有',
];

const detail = async function (code) {
    const promises = diggers.map(handler => handler(code));
    const groups = await Promise.all(promises);
    const result = Object.assign({}, ...groups);

    return result;
};

const digger = async function (keyword, options) {
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
    digger,
    search,
    detail
}
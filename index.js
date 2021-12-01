import fs from 'fs';

import search from './search.js';
import basic from "./basic.js";
import holder from "./holder.js";
import tariff from "./tariff.js";
import classify from "./classify.js";
import { MODE } from "./config.js";

const components = [basic, holder, tariff, classify];

const titles = [
    '基金代码', '基金名称',
    '基金规模', '成立日期', '跟踪误差', '近3年收益率',
    '机构持有', '个人持有', '内部持有',
    '申购费率', '运作费率',
    '交易方式', '收费方式', '特殊标签'
];

const combine = async function (code, name, tags) {
    const promises = components.map(handler => handler({ code, name }));
    const groups = await Promise.all(promises);
    const data = Object.assign({}, ...groups);
    const result = [code, name, ...tags.map(key => data[key])];

    return result;
};

const digger = async function (keyword, type) {
    console.time(MODE);
    const list = await search(keyword, type);
    const output = fs.createWriteStream('output.txt');
    const total = list.length;
    let count = 0;
    let promises = [];

    output.write(`${titles.join('\t')}\n`);

    // TODO: 串行模式有QPS限制的问题，大概QPS 30
    if (MODE === 'parallel') {
        promises = list.map(async ({ code, name }) => {
            const item = await combine(code, name, titles.slice(2));
            output.write(`${item.join('\t')}\n`);
            console.log(`${count += 1}/${total} ${code}:${name} 处理完成`);
        });
    } else {
        for (let { code, name } of list) {
            const item = await combine(code, name, titles.slice(2));
            output.write(`${item.join('\t')}\n`);
            console.log(`${count += 1}/${total} ${code}:${name} 处理完成`);
        }
    }

    await Promise.all(promises);
    output.end();
    console.timeEnd(MODE);
};

const [, , ...args] = process.argv;

if (args.length) {
    digger(...args).catch(console.error);
}
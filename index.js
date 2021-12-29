import fs from 'fs';

import search from './search.js';
import basic from "./basic.js";
import holder from "./holder.js";
import tariff from "./tariff.js";
import classify from "./classify.js";
import { MODE, QPS } from "./config.js";

const components = [basic, holder, tariff, classify];

const titles = [
    '基金代码', '基金名称',
    '基金规模', '成立日期', '跟踪误差', '近1年收益率', '近3年收益率', '分红次数',
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

const delay = function (delay) {
    return new Promise(function (resolve, reject) {
        setTimeout(resolve, delay);
    });
};

const digger = async function (keyword, type) {
    const list = await search(keyword, type);
    const output = fs.createWriteStream('output.csv');
    const total = list.length;
    let count = 0;

    output.write(`\uFEFF${titles}\n`);

    if (MODE === 'parallel') {
        const limit = Math.ceil(total / QPS);

        for (let i = 0; i < limit; i += 1) {
            const start = i * QPS, end = start + QPS;
            const flag = Date.now();
            const promises = list.slice(start, end).map(async ({ code, name }) => {
                const item = await combine(code, name, titles.slice(2));
                output.write(`${item}\n`);
                console.log(`${count += 1}/${total} ${code}:${name} 处理完成`);
            });

            await Promise.all(promises);
            if (end < total) {
                await delay(Math.max(0, 1100 - Date.now() + flag));
            }
        }
    } else {
        for (let { code, name } of list) {
            const item = await combine(code, name, titles.slice(2));
            output.write(`${item}\n`);
            console.log(`${count += 1}/${total} ${code}:${name} 处理完成`);
        }
    }

    output.end();
};

const [, , keyword, type] = process.argv;

if (keyword) {
    console.time(MODE);
    await digger(keyword, type).catch(console.error);
    console.timeEnd(MODE);
}
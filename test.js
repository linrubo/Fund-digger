import basic from './basic.js';
import holder from './holder.js';
import tariff from './tariff.js';
import search from './search.js';
import classify from './classify.js';
import { MODE, QPS } from './config.js';

const components = {
    basic,
    holder,
    tariff,
    classify
};

const delay = function (delay) {
    return new Promise(function (resolve, reject) {
        setTimeout(resolve, delay);
    });
};

const test = async function (component, keyword, type) {
    const list = await search(keyword, type);
    const total = list.length;
    let count = 0;

    if (MODE === 'parallel') {
        const limit = Math.ceil(total / QPS);

        for (let i = 0; i < limit; i += 1) {
            const start = i * QPS, end = start + QPS;
            const flag = Date.now();
            const promises = list.slice(start, end).map(async ({ code, name }) => {
                const result = await component({ code, name });
                console.log(`${count += 1}/${total}`, `${code}:${name}`, JSON.stringify(result));
            });

            await Promise.all(promises);
            if (end < total) {
                await delay(Math.max(0, 1100 - Date.now() + flag));
            }
        }
    } else {
        for (let { code, name } of list) {
            const result = await component({ code, name });
            console.log(`${count += 1}/${total}`, `${code}:${name}`, JSON.stringify(result));
        }
    }
};

const [, , component, ...args] = process.argv;

if (component && args.length) {
    console.time(MODE);
    await test(components[component], ...args).catch(console.error);
    console.timeEnd(MODE);
}
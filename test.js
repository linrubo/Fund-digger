import basic from './basic.js';
import holder from './holder.js';
import tariff from './tariff.js';
import search from './search.js';
import classify from './classify.js';
import { MODE } from './config.js';

const components = {
    basic,
    holder,
    tariff,
    classify
};

const test = async function (component, keyword, type) {
    console.time(MODE);
    const list = await search(keyword, type);
    const total = list.length;
    let count = 0;
    let promises = [];

    if (MODE === 'parallel') {
        promises = list.map(async ({ code, name }) => {
            const result = await component({ code, name });
            console.log(`${count += 1}/${total}`, `${code}:${name}`, JSON.stringify(result));
        });
    } else {
        for (let { code, name } of list) {
            const result = await component({ code, name });
            console.log(`${count += 1}/${total}`, `${code}:${name}`, JSON.stringify(result));
        }
    }

    await Promise.all(promises);
    console.timeEnd(MODE);
};

const [, , component, ...args] = process.argv;

if (component && args.length) {
    test(components[component], ...args).catch(console.error);
}
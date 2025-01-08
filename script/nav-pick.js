// 获取净值列表中指定日期的净值
import prices from "../digger/prices.js";

const code = '050027';
const start = '2024-12-01';
const end = '2024-12-31';
const dates = [
    '2024-12-10',
    '2024-12-12',
    '2024-12-14',
    '2024-12-16',
    '2024-12-18',
    '2024-12-20'
];
const list = await prices(code, start, end, { reverse: true });
const result = list.filter(([date]) => {
    return dates.includes(date);
})

console.log(result.map(row => row.join('\t')).join('\n'));

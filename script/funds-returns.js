// 获取基金列表指定年度的收益率数据
import returns from "../digger/returns.js";

const funds = `
270048
050027
003547`.trim().split('\n');
const start = 2017;
const end = 2024;
const result = [];

for (const code of funds) {
    const data = await returns(code, {
        reverse: true
    });

    const row = [code];
    data.forEach(([year, value]) => {
        if (year >= start && year <= end) {
            row.push(value);
        }
    });
    result.push(row);
}

console.log(result.map(row => row.join('\t')).join('\n'));
#!/usr/bin/env node

import { mkdir, writeFile, appendFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { program } from 'commander';
import { digger, search, detail, prices } from '../index.js';

program.name('fund')
    .version('1.0.0')
    .usage('[command] [options]')
    .hook('preAction', (program, command) => {
        console.time(command.name());
    })
    .hook('postAction', (program, command) => {
        console.timeEnd(command.name());
    });

program.command('digger')
    .description('fund search and information collection')
    .argument('<keyword>', 'fund name keyword')
    .option('-f, --filter <tags...>', 'filter by specified tags', [])
    .option('-e, --exclude <tags...>', 'exclude based on specified tags', [])
    .option('-m, --morningstar', 'search from www.morningstar.cn')
    .action(async (keyword, options) => {
        const folder = path.join(os.homedir(), '/fund-digger/');
        const filename = [keyword, ...options.filter].join('-');
        const filepath = path.join(folder, `${filename}.csv`);
        const result = await digger(keyword, options);

        if (result.length) {
            await mkdir(folder, { recursive: true });
            await writeFile(filepath, '\uFEFF');
            await appendFile(filepath, result.map(row => row.join()).join('\n'));
        }
    });

program.command('search')
    .description('search funds by keyword')
    .argument('<keyword>', 'fund name keyword')
    .option('-f, --filter <tags...>', 'filter by specified tags', [])
    .option('-e, --exclude <tags...>', 'exclude based on specified tags', [])
    .option('-m, --morningstar', 'search from www.morningstar.cn')
    .action(async (keyword, options) => {
        const result = await search(keyword, options);
        console.log(result.map(({ code, name }) => [code, name].join('\t')).join('\n'));
    });

program.command('detail')
    .description('get fund details')
    .argument('<code>', 'fund code')
    .action(async (code) => {
        const result = await detail(code);
        console.log(JSON.stringify(result, null, 4));
    });

program.command('prices')
    .description('get daily, month-end or year-end fund prices')
    .argument('<code>', 'fund code')
    .argument('[start]', 'start date, format: yyyy-mm-dd')
    .argument('[end]', 'end date, format: yyyy-mm-dd')
    .option('-i, --interval <month, year>', 'interval frequency')
    .option('-c, --cumulative', 'includes historical dividends')
    .option('-r, --reverse', 'reverse order')
    .action(async (code, start, end, options) => {
        const result = await prices(code, start, end, options);
        console.log(result.map(item => item.join('\t')).join('\n'));
    });

program.parse();

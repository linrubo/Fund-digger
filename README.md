# Fund-digger

## 安装
```shell
npm install
npm link
```

## 示例
基金搜索并挖掘详细信息，结果导出在 ***~/fund-digger/***
```shell
fund dig 沪深300 -f ETF
```

基金搜索
```shell
fund search 沪深300 -f 场外 A
```

基金详情
```shell
fund detail 510300
```

基金净值，默认最近20天
```shell
fund prices 510300
```

基金回报，默认年度
```shell
fund returns 510300
```

基金分红记录
```shell
fund dividends 510300
```
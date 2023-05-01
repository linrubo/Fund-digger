# Fund-digger

## 安装
```shell
npm install
npm link
```

## 示例
基金搜索并采集详情，结果导出在 ***~/fund-digger/***
```shell
fund digger 沪深300 -f ETF
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
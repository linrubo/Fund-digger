# Fund-digger

## 用法
```shell
node index.js keyword [type]
```
参数：
* keyword
* type { 场内 | 场外 | 联接 | 增强 | 随便什么吧 }

结果输出在 ***output.txt*** 文件中，导入到Excel后，就可以：
* 从 **交易方式**、**收费方式**、**特殊标签** 维度筛选
* 从 **基金规模**、**跟踪误差**、**近3年收益率**、**申购费率**、**运作费率** 等维度排序


## 示例
```shell
node index.js 沪深300 场内
```

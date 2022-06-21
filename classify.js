const classes = {
    '交易方式': name => {
        return /ETF(?:\(QDII\))?$/i.test(name) ? '场内' : '场外';
    },
    '收费方式': name => {
        return name.match(/[ABC](?=\/[ABC])?/)?.[0] ?? '';
    },
    '特殊标签': name => {
        return ['联接', '增强', '指数', 'ETF'].filter(item => name.lastIndexOf(item) !== -1)[0] ?? '';
    }
};

const classify = function ({ name }) {
    const result = {};

    Object.entries(classes).forEach(([key, handler]) => {
        result[key] = handler(name);
    });

    return result;
};

export default classify;
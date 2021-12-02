const classes = {
    '交易方式': name => {
        return /ETF(?:\(QDII\))?$/i.test(name) ? '场内' : '场外';
    },
    '收费方式': name => {
        return name.match(/(?:A|B|C)(?!A|B|C)/)?.[0] ?? '';
    },
    '特殊标签': name => {
        return name.match(/(?:ETF|联接|增强|指数)(?!ETF|联接|增强|指数)/)?.[0] ?? '';
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
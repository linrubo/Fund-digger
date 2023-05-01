const buildURL = function (baseURL, params) {
    const url = new URL(baseURL);

    Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, value);
    });

    return url.toString();
};

export {
    buildURL
};
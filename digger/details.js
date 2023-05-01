import getBasicInfo from './basic.js';
import getStageReturns from './stage-returns.js';
import getFeeRates from './fees.js';
import getHolderStructure from './holder.js';

const handles = [getBasicInfo, getStageReturns, getFeeRates, getHolderStructure];

const getDetails = async function (code) {
    const promises = handles.map(handle => handle(code));
    const results = await Promise.all(promises);

    return Object.assign({}, ...results);
};

export default getDetails;

const repo = require('../data/repository');

async function getExchangeRate(src, tgt) {
    let target =  await repo.getExchangeRate(src, tgt);
    if(target) return target;

    // 환율 데이터 없을때, 역방향 환율 계산하여 제공
    target = await repo.getExchangeRate(tgt, src);
    if (target) {
        return {
            src,
            tgt,
            rate: 1 / target.rate,
            date: target.date
        };
    }
}

async function postExchangeRate(info) {
    let { src, tgt, rate, date } = info;

    if (src === tgt){ // src와 tgt 화폐단위가 같은 경우 rate를 1로 보정하여 DB로 전달
        rate = 1;
    }
    return await repo.postExchangeRate( src, tgt, rate, date);
}

async function deleteExchangeRate(info) {
    return await repo.deleteExchangeRate(info);
}

module.exports = {
    getExchangeRate,
    postExchangeRate,
    deleteExchangeRate,
};
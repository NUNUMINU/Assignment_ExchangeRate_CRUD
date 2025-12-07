const ExchangeInfo = require("./exchangeInfo");

async function getExchangeRate(src, tgt) { // 최근 환율 데이터 제공
    return ExchangeInfo
        .findOne({src, tgt})
        .sort({date: -1})
}

async function postExchangeRate(src, tgt, rate, date){ // 환율 데이터 있다면 업데이트, 없다면 등록
    if (!date) { // 날짜 값 없으면, 오늘 날짜로 등록
        date = new Date().toISOString().slice(0, 10);
    }

    return ExchangeInfo.findOneAndUpdate(
        { src, tgt, date },
        { src, tgt, rate, date },
        { new: true, upsert: true }
    );
}

async function deleteExchangeRate(info) { // 환율 데이터 삭제
    let { src, tgt, date } = info;

    return ExchangeInfo.findOneAndDelete({ src, tgt, date });
}

module.exports = {
    getExchangeRate,
    postExchangeRate,
    deleteExchangeRate,
};
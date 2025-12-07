const { gql } = require('apollo-server-express');

const typeDefs = gql`
    
    "환율업데이트정보 Input"
    input InputUpdateExchangeInfo {
        "소스통화, krw, usd"
        src: String!
            "타겟통화"
        tgt: String!
            "환율"
        rate: Float!
            "기준일, 값이 없으면, 최신일자로 등록"
        date: String
    }
    
    "환율삭제 Input"
    input InputDeleteExchangeInfo {
        "소스통화"
        src: String!
            "타겟통화"
        tgt: String!
            "기준일"
        date: String!
    }
`;


module.exports = {
    typeDefs: typeDefs,
}
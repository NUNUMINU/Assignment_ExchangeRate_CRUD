const { gql } = require('apollo-server-express');

const typeDefs = gql`
    
    """
    @key directive Apollo Federation 환경에서 사용되는 기능
    현재 과제에선 단일 서버로 구현하기에 에러가 발생해 비활성화
    """
    directive @key(fields: String!) on OBJECT | INTERFACE
    
    "환율정보"
    type ExchangeInfo @key(fields: "src, tgt") {
        "소스통화"
        src: String!
            "타겟통화"
        tgt: String!
            "환율"
        rate: Float!
            "기준일, 값이 없으면, 최신일자의 환율을 응답"
        date: String!
    }
`;


module.exports = {
    typeDefs: typeDefs,
}
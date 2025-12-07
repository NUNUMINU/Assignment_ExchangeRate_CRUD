const { gql } = require('apollo-server-express');
const exchangeService = require('../../service/service');

const typeDefs = gql`
    
    type Query {
        "환율조회 (역방향 환율 계산 가능)"
        getExchangeRate(src:String!, tgt:String!): ExchangeInfo
    }
   `

const resolvers = {
    Query: {
        getExchangeRate: async (parent, args, context, info) => {
            return await exchangeService.getExchangeRate(args.src, args.tgt);
        }
    }
}

module.exports = {
    typeDefs: typeDefs,
    resolvers: resolvers
}
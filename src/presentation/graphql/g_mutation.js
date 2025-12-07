const { gql } = require('apollo-server-express');
const exchangeService = require('../../service/service');

const typeDefs = gql`
    
    type Mutation {
        "환율등록, src, tgt, date에 대해서 upsert"
        postExchangeRate(info: InputUpdateExchangeInfo): ExchangeInfo
        "환율삭제, 해당일자의 해당 통화간 환율을 삭제"
        deleteExchangeRate(info: InputDeleteExchangeInfo): ExchangeInfo
    }
`

const resolvers = {
    Mutation:{
        postExchangeRate: async (parent, args, context, info) => {
            return await exchangeService.postExchangeRate(args.info)
        },

        deleteExchangeRate: async (parent, args, context, info) => {
            return await exchangeService.deleteExchangeRate(args.info)
        }
    }
}


module.exports = {
    typeDefs: typeDefs,
    resolvers: resolvers
}
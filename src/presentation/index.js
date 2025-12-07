const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const PORT = 5110;

const mongoose = require("mongoose");
const MONGO_CON = "mongodb://localhost:27017/exchange-db"; // 테스트(로컬 환경)

// GraphQL 스키마 정의
const Query = require('./graphql/g_query');
const Mutation = require('./graphql/g_mutation');
const ExchangeInfo = require('./graphql/g_exchangeInfo');
const Input = require('./graphql/g_inputs');

const typeDefs = [
    Query.typeDefs, Mutation.typeDefs, ExchangeInfo.typeDefs, Input.typeDefs
];

const resolvers = [
    Query.resolvers, Mutation.resolvers
];

async function startServer() {
    try {
        await mongoose.connect(MONGO_CON);
        console.log("몽고디비 연결 성공");

        const app = express();
        const server = new ApolloServer({typeDefs, resolvers});

        await server.start()
        server.applyMiddleware({ // [ /graphql ] 요청만 Apollo 서버가 처리하게 연결
            app,
            path: "/graphql"
        });

        app.get("/", (req, res) => {
                res.send("안녕하세요!");
            }
        )

        app.listen(PORT, () => {
            console.log(`Express -> http://localhost:${PORT} ~ 요청 처리`);
            console.log(`Apollo -> http://localhost:${PORT}/graphql 요청 처리`);
        });
    } catch (err) {
        console.error("error 발생: ", err);
    }
}

startServer();

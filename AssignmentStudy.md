1) Node.js의 장점
- 비동기 I/O 및 이벤트 루프 기반 구조: 이벤트 루프와 논블로킹 I/O덕분에 동시에 많은 요청을 처리하는 데 매우 효율적이다.
- npm을 통해 다양한 기능의 라이브러리를 도입하는 게 수월하다.
- 다만, 실행 스레드가 싱글 스레드이므로 CPU 바운드 작업을 하면 전체 서버가 먹통이 될 수 있다.

1-1) Promise, async, await
- Node.js에서 DB 조회와 같은 비동기 I/O 작업은 논블로킹 방식으로 백그라운드에서 진행된다. 이때 I/O가 완료되기 전에 JS 엔진이 return코드를 실행해버리면, 데이터가 아직 준비되지 않은 상태에서 함수가 종료되는 문제가 발생할 수 있다. 이를 방지하기 위해 비동기 작업이 완료될 때까지 기다리게 만드는 장치가 필요하며, 그것이 Promise -> async/await 체계다.
- async는 함수를 항상 Primise를 반환하는 비동기 함수로 만들고, await은 Promise가 완료될 때까지 해당 함수의 실행을 일시 중단한다.
- 과제에서도 async/await 을 사용하여 이러한 문제를 해결하였다. 예를 들어 service.js에서
```sh
async function deleteExchangeRate(info) {
    return await repo.deleteExchangeRate(info);
}
```
Service 계층에서 await 키워드는 Data Access계층이 데이터를 반환할 때까지 deleteExchangeRate 함수의 진행을 멈추게 한다. 데이터가 준비되면 다시 실행을 재개하고, 최종적으로 presentation계층으로 결과를 정상적으로 전달할 수 있는 것이 보장된다.

2) GraphQL의 장점
- 오버페칭, 언더페칭(필요로 하는 데이터를 얻기 위해 여러번 요청을 해야 하는 문제) 해결
- REST API 처럼 여러 엔드포인트 만들 필요 없이 단일 엔드포인트로 처리할 수 있다.
- 다만, GraphQL은 “타입은 어떻게 정의해야 하고, 쿼리는 어떻게 작성해서 보내야 한다”는 규칙을 정의한 것이고, 그 규칙대로 작성된 쿼리가 실제로 동작(파싱 -> 스키마 검증 -> 리졸버 실행 -> 결과 응답)하도록 하는 것은 Apollo Server같은 구현체다.

3) NoSQL 장점
- JSON 형태처럼 유연한 구조로 데이터 저장 가능
- 비정형 데이터(문서, 그래프 등)을 처리하는데 강점이 있다.
- 과제 문제처럼 스키마의 구조가 명확히 주어지면, RDBMS에 비해 강점이 없으나. 향후 구조가 달라지게 되더라도 저장/조회에 문제가 생기지 않는 점이 장점이 될 수 있다.

4) 3-Layer 아키텍처
- 애플리케이션을 역할별로 3 계층으로 나눠 설계하는 방법이다. 
- Presentation 계층: 사용자의 요청을 받아 비즈니스 레이어로 전달하고, 결과를 보여주는 역할
- Service 계층: 요청을 해석하고 비즈니스 로직에 맞게 처리하는 역할
- Data Access 계층: DB 등 실제 데이터와 통신하는 역할
- 이러한 구조 덕에 각 계층이 독립적으로 작동될 수 있음
- 과제에서도 이 구조를 채택해 Presentation 계층으로 expree 서버와 Apollo 서버를 사용, Service 계층으로 service.js에서 환율 관련 비즈니스 로직 처리 Data Access 계층으로, repository.js에서 실제 DB 접근 및 CRUD 로직 처리 형태로 나누어 구현했다.

5) Apollo Server
- 개발자가 작성한 typeDefs를 gql(템플릿 리터럴 태그)로 파싱하여 AST로 파싱되며, Apollo Server는 이를 기반으로 GraphQL 스키마를 생성한다. 이를 통해 서버 부팅 단계에서 문법 오류를 사전에 검출할 수 있다.
- QraphQL 요청의 처리 과정은,
수신 -> 쿼리 문자열 파싱(AST 생성) -> 스키마 기반 유효성 검사 -> 실행 준비 -> 리졸버 실행 -> 응답 JSON 생성 -> 응답 반환 순으로 이뤄진다.
- 다만 Apollo Server는 하나의 엔드포인트( /graphql)만을 처리하도록 설계되어 있어 정적 HTML 서빙과 같이 여러 HTTP 경로를 운영할 수 없다. 이러한 기능이 필요하다면 Appolo Server는 GraphQl을 핸들링 하는 용도로, 전체 웹 서버는 Express로 함께 구성하는 것이 권장된다. (https://www.apollographql.com/docs/apollo-server/v3/integrations/middleware)
이에 따라 과제에서도 Appolo Server는 GraphQl을 핸들링 하는 용도로 사용하고, 전체 웹 서버는 Express로 구현하여, 각 기능을 테스트 해봤고 잘 동작하는 것을 확인했다.

6) GraphQL Federation
- 여러 GraphQL 서비스의 GraphQL 스키마를 조합해 하나의 큰 GraphQL 스키마처럼 보이도록 만드는 방식이다.
- Federation Directives: 분산된 스키마를 통합하기 위해, 타입 간 경계와 엔티티 정보를 기술하는 데 사용되는 특별한 지시어로 이 중 @key는 여러 서비스가 공유하는 type(엔티티)에서 식별자 필드를 나타낸다.
과제에서도
```
shtype ExchangeInfo @key(fields: "src, tgt"){ … }
```
  ExchangeInfo가 엔티티로 설계되어 있다. 하지만 현재 과제에서는 단일 Apollo Server를 사용하고 있더 federation이 활성화된 환경이 아니기에 @key를 인식하지 못해 에러가 발생한다.
  실제  @apollo/subgraph에서 gql을 불러와 서브그래프용 스키마로 전환하여 에러를 해결할 수 있으나 이번 과제에서는 directive @key(fields: String!) on OBJECT | INTERFACE 문장을 추가해 @key의 기능을 비활성화했다.


## Node.js + Graphql + MongoDB를 활용한 환율 정보 CRUD 과제

### 환율 정보(소스통화, 타겟통화, 환율, 기준일)를 조회/등록/삭제할 수 있는 GraphQL 기반 API 서버입니다.
---

### 1. 주요 기능
- 원화(KRW) <-> 미화(USD)의 최근 환율 정보 조회
- 역방향 환율 자동 계산 (예: KRW -> USD 환율 정보 없으면 USD -> KRW의 역수 반환)
- 동일 통화를 대상으로 환율 데이터 등록 시 환율 1로 보정하여 등록
- 환율 정보 등록 및 삭제


### 2. 설치 & 실행 방법
```sh
# 0. node.js 설치

# 1) 저장소 클론
git clone https://github.com/NUNUMINU/Assignment_ExchangeRate_CRUD.git
cd Assignment_ExchangeRate_CRUD

# 2) 의존성 패키지 설치
npm install

# 3) MongoDB 실행(서버 실행 시 로컬에서 MongoDB가 실행 중이어야 정상적으로 연결됩니다.)
(Mac OS)
a) 터미널 실행
b) brew services start mongodb-community

(Window OS, 환경 변수 설정이 되어있어야 합니다.)
a) cmd 실행 
b) MongoDB 설치 경로로 이동 
c) mongod 입력

# 4. 서버 실행
npm start
```


### 3. 프로젝트 구조
![프로젝트 구조 사진](https://postfiles.pstatic.net/MjAyNTEyMDhfNzMg/MDAxNzY1MTQyNTIxODA3._08KkmFhk36cBNblvuf7k_GXuAA1EV4m-NzcP1n1O5wg.kfRQu-zGBLm4ikF79eui4ALEe6aK3BnuypTMtJcFLDcg.PNG/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7_2025-12-08_06.21.00.png?type=w3840)


### 4. 테스트 스크립트
```sh
# 1) 환율 조회 스크립트(1)
curl -XPOST "http://localhost:5110/graphql" --silent \
-H  "accept: application/json" \
-H  "Content-Type: application/json" \
-d '
{ 
  "query": "query { getExchangeRate (src: \"krw\", tgt: \"usd\") { src tgt rate date } }"
}
' | jq
```

```sh
# 2) 환율 조회 스크립트(2)
curl -XPOST "http://localhost:5110/graphql" --silent \
-H  "accept: application/json" \
-H  "Content-Type: application/json" \
-d '
{ 
  "query": "query { getExchangeRate (src: \"usd\", tgt: \"krw\") { src tgt rate date } }"
}
' | jq
```

```sh
# 3) 환율 조회 스크립트(3)
curl -XPOST "http://localhost:5110/graphql" --silent \
-H  "accept: application/json" \
-H  "Content-Type: application/json" \
-d '
{ 
  "query": "query { getExchangeRate (src: \"usd\", tgt: \"usd\") { src tgt rate date } }"
}
' | jq
```

```sh
# 4) 환율 조회 스크립트(4)
curl -XPOST "http://localhost:5110/graphql" --silent \
-H  "accept: application/json" \
-H  "Content-Type: application/json" \
-d '
{ 
  "query": "query { getExchangeRate (src: \"krw\", tgt: \"krw\") { src tgt rate date } }"
}
' | jq
```

```sh
# 5) 환율 등록(업데이트) 스크립트(1)
curl -XPOST "http://localhost:5110/graphql" --silent \
-H  "accept: application/json" \
-H  "Content-Type: application/json" \
-d '
{ 
  "query": "mutation { postExchangeRate (info: { src: \"usd\", tgt: \"krw\", rate: 1342.11, date:\"2022-11-28\" }) { src tgt rate date } }"
}
' | jq
```

```sh
# 6) 환율 등록(업데이트) 스크립트(2)
curl -XPOST "http://localhost:5110/graphql" --silent \
-H  "accept: application/json" \
-H  "Content-Type: application/json" \
-d '
{ 
  "query": "mutation { postExchangeRate (info: { src: \"krw\", tgt: \"krw\", rate: 2.0, date:\"2022-11-28\" }) { src tgt rate date } }"
}
' | jq
```

```sh
# 7) 환율 삭제 스크립트(1)
curl -XPOST "http://localhost:5110/graphql" --silent \
-H  "accept: application/json" \
-H  "Content-Type: application/json" \
-d '
{ 
  "query": "mutation { deleteExchangeRate (info: { src: \"usd\", tgt: \"krw\", date:\"2022-11-28\" }) { src tgt rate date } }"
}
' | jq
```

```sh
# 8) 환율 삭제 스크립트(2)
curl -XPOST "http://localhost:5110/graphql" --silent \
-H  "accept: application/json" \
-H  "Content-Type: application/json" \
-d '
{ 
  "query": "mutation { deleteExchangeRate (info: { src: \"krw\", tgt: \"krw\", date:\"2022-11-28\" }) { src tgt rate date } }"
}
' | jq
```


### 5. 사용 기술 stack
<img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white"> <img src="https://img.shields.io/badge/express-000000?style=for-the-badge&logo=express&logoColor=white"> <img src="https://img.shields.io/badge/apollo%20graphql-311C87?style=for-the-badge&logo=apollo-graphql&logoColor=white"> <img src="https://img.shields.io/badge/mongodb-47A248?style=for-the-badge&logo=MongoDB&logoColor=white"> <img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">

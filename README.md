# Young_Backend_Serverless

⏰ MVP 개발  |  2024.05.06 ~ 2024.06.14<br/>
⚡ 트러블슈팅 및 개선  |  2024.06.15 ~ ing<br/><br/>
Node.js 백엔드 ➡️ Lambda 기반 서버리스 백엔드 <br/>
서버리스를 경험하고 AWS 서비스를 직접 활용하기 위해 시작한 프로젝트입니다. <br/>

## Details

- Node.js 20.x 런타임과 CommonJs 문법을 활용했습니다.
- 📁models 와 📁utils 를 제외한 모든 파일은 각각 Lambda 함수 하나의 index.js입니다.
- Lambda Authorizer를 활용하여 JWT 유효성을 검증했습니다.
- CloudFront를 연결한 S3로 정적 이미지 파일을 배포했습니다.
- 모듈은 Lambda Layer로 추가하여 활용했습니다.

## Architecture

![image](https://github.com/Young-Season/Young_Backend_Serverless/assets/83288181/f67ffedb-6038-4cfc-b4a6-4d32629b04b2)

## Trouble Shooting
- [] 개별 API 호출 시간 개선
      - Before: API 전부 분리
        - 초기 호출 평균 약 3.8초
        - 재호출 평균 약 0.3초

## Articles @hnnynh
- [[서버리스] AWS Lambda 백엔드 아키텍처 비교하기](https://velog.io/@hnnynh/%EC%84%9C%EB%B2%84%EB%A6%AC%EC%8A%A4-AWS-Lambda-%EB%B0%B1%EC%97%94%EB%93%9C-%EC%95%84%ED%82%A4%ED%85%8D%EC%B2%98-%EB%B9%84%EA%B5%90%ED%95%98%EA%B8%B0)
- [[서버리스] API Gateway Authorizer](https://velog.io/@hnnynh/API-Gateway-Authorizer)
- [[서버리스] 백엔드 Lambda 서버리스 마이그레이션 방법](https://velog.io/@hnnynh/%EB%B0%B1%EC%97%94%EB%93%9C-Lambda-%EC%84%9C%EB%B2%84%EB%A6%AC%EC%8A%A4-%EB%A7%88%EC%9D%B4%EA%B7%B8%EB%A0%88%EC%9D%B4%EC%85%98-%EB%B0%A9%EB%B2%95)
- [[서버리스] Node.js 백엔드 AWS 서버리스 마이그레이션 회고](https://velog.io/@hnnynh/%EC%84%9C%EB%B2%84%EB%A6%AC%EC%8A%A4-%EB%A7%88%EC%9D%B4%EA%B7%B8%EB%A0%88%EC%9D%B4%EC%85%98-%ED%9A%8C%EA%B3%A0)
- [[서버리스] Github Action으로 Lambda 업데이트하기](https://velog.io/@hnnynh/%EC%84%9C%EB%B2%84%EB%A6%AC%EC%8A%A4-Github-Action%EC%9C%BC%EB%A1%9C-Lambda-%EC%97%85%EB%8D%B0%EC%9D%B4%ED%8A%B8%ED%95%98%EA%B8%B0)

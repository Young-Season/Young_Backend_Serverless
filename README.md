# Young_Backend_Serverless

⏰2024.05.06 ~ 2024.06.14<br/><br/>
Express.js 백엔드 ➡️ Lambda 기반 서버리스 백엔드 <br/>
서버리스를 경험하고 AWS 서비스를 직접 활용하기 위해 시작한 프로젝트입니다. <br/>

## Details

- Node.js 20.x 런타임과 CommonJs 문법을 활용했습니다.
- 📁models 와 📁utils 를 제외한 모든 파일은 각각 Lambda 함수 하나의 index.js입니다.
- Lambda Authorizer를 활용하여 JWT 유효성을 검증했습니다.
- CloudFront를 연결한 S3로 정적 이미지 파일을 배포했습니다.
- 모듈은 Lambda Layer로 추가하여 활용했습니다.

## Architecture

![](https://file.notion.so/f/f/e9862251-b3e1-4c44-82dd-36627a50b5aa/7629aa91-81d7-4aeb-9663-7858214d79bd/Untitled.png?id=1b7f5823-ed97-48df-bbde-25e929b35e15&table=block&spaceId=e9862251-b3e1-4c44-82dd-36627a50b5aa&expirationTimestamp=1718496000000&signature=_S-8FO0nppzmSMQmy3n8PQC7fIki6pmFgREP9SoNCv0&downloadName=Untitled.png)

## Articles @hnnynh

#### [[서버리스] AWS Lambda 백엔드 아키텍처 비교하기](https://velog.io/@hnnynh/%EC%84%9C%EB%B2%84%EB%A6%AC%EC%8A%A4-AWS-Lambda-%EB%B0%B1%EC%97%94%EB%93%9C-%EC%95%84%ED%82%A4%ED%85%8D%EC%B2%98-%EB%B9%84%EA%B5%90%ED%95%98%EA%B8%B0)

#### [[서버리스] API Gateway Authorizer](https://velog.io/@hnnynh/API-Gateway-Authorizer)

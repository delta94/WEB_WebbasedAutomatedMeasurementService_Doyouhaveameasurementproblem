# WEB_WebbasedAutomatedMeasurementService_Doyouhaveameasurementproblem

: 산업용 계측장비 제어 및 측정값 분석 등 기능을 웹 서비스로 제공

# 개발 상세 설명

- 정밀측정장비를 원격으로 다루기 위한 node.js express 기반 REST API 서버입니다.

- GET, POST 명령어를 서버로 보내면, 서버에서 측정장비로 부터 측정된 데이터를 가져와 json 형식의 파일로 클라이언트에게 보내줍니다.

# 개발 BlockDiagram

<img  src="https://user-images.githubusercontent.com/5003195/94947247-4a5e9a80-0518-11eb-8193-8b552c5c7a68.jpg"  width  =  "85%"  class  =  "center"></img>

# 컴퓨터 구성 / 필수 조건

- 운영제체 : Linux Only
- [Linux GPIB Package](https://sourceforge.net/projects/linux-gpib/files/linux-gpib%20for%203.x.x%20and%202.6.x%20kernels/4.3.3/)를 설치하고 GPIB장치를 완전히 구성
- [Linux GPIB Package와 호환되는 GPIB 인터페이스](https://linux-gpib.sourceforge.io/doc_html/supported-hardware.html). (ex GPIB-USB-B Adapter).
- GPIB 규격의 측정 장비 (ex [34401A](https://kr.element14.com/productimages/standard/en_GB/1335866-40.jpg))

# 기술 스택(Technique Used)

## Back-end

- node.js
- express.js
- REST API

## Front-end

- React.js

# 설치 안내(Installation Process) / 구성(Structure)

1. [node.js LTS 버전 설치하기.](https://nodejs.org/ko/)

2. [git 설치하기](https://git-scm.com/)

3. git 환경변수 등록하기. [참고](https://cofs.tistory.com/421)

4. 본 프로젝트 로컬 PC에 클론하기.  
   `$ git clone https://github.com/osamhack2020/WEB_WebbasedAutomatedMeasurementService_Doyouhaveameasurementproblem.git`

5. 해당 폴더에서 종속 라이브러리 설치  
   `$ cd WEB_WebbasedAutomatedMeasurementService_Doyouhaveameasurementproblem`  
   `$ npm install or yarn install`

6. 서버 실행  
   ` $ npm run start or yarn start # front-end 서버 실행`
   ` $ node server/server.js # back-end 서버 실행`

7. 실행 확인
  - http://localhost:3000 # front-end
  - http://localhost:2020/api # back-end

## Linux GPIB

1. VSCP(Visual Studio Codespace) 환경 : LINUX 환경

2. 구형장비(34401A) 경우 GPIB 컨트롤러를 통해 장비 제어하며, 아래와 같은 킷헙의 자료를 참고 가능함. [참조(김영주님 검색결과)](https://github.com/jue89/node-linux-gpib.git)

## GET

- Voltage DC (AC 경우 'MESA:VOLT:AC' 만 변경해주면 됨.)

- Current DC (AC 경우 'MESA:CURR:AC' 만 변경해주면 됨.)

- Resistance 저항측정(2Wire 와 4Wire 기능 있으며, 4Wire 경우 'MEAS:FRES? 임)

- Frequency 주파수 측정

- Period 주파수 측정

## NOTE

- 설정값을 설정하는 부분은 세부 설명이 필요하나, 요약컨대 장비가 정확한 측정을 위해선 장비 측정범위를 설정해줘야함.

e.g. DC 100 V 전압을 측정하려면 100V 범위에서 측정해야함으로 보통 'CONF:VOLT:DC 100' 이런식으로

- 장단점으로는 위에 명시한 'MEAS:VOLT:DC?' 는 현재 장비에서 가지고 있는 값을 바로 보내주는 경우이고

'CONF:VOLT:DC 100' 경우는 write 만 명령한 거임. 'READ?' 해야한 현재 가지고 있는 값을 보내 준다.

- 왜냐하면 장비 자체 측정이 Delay가 생겨서 위와 같은 'MEAS:VOLT:DC?'가 하다보면 NULL 값이 인식 되는 경우가 있어서임.

- 허나 자체 장비 측정 시간에 대한 Delay 값을 준다면 문제 없음

# 팀 정보(Team Information)

- 이재용(ljy13579@naver.com) ,Github_ID : NevErdiEkilLeR

- 김영주(fjvbn2003@gmail.com) , Github_ID : fjvbn2003

- 권기남(ginami0129g@gmail.com) , Github_ID : ginami0129g

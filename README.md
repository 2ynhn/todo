# todo
todo list, node file system save json, multi user


## node 설치, 버전 확인
```
$ node -v
$ npm -v
```

## Node modules 설치 : package.json 에 있는 모듈들이 설치 됩니다.
```
$ npm install
```

## express 서버 실행 : package.json 의 "script" 의 "start" 를 수행합니다.
```
$ npm start
```
- 실행결과 : localhost:3000 이 열립니다.
- 서버 중지 : 터미널에서 Ctrl + C 로 express 중지 
- server.js 수정 시 서버 재 시작이 필요합니다.

## config.js
- config.js 는 gitignore 에 추가하세요.
- users 중 한명에게 role : master 로 지정 해 주세요.
- theme : "dark" => dark.css를 추가로 로드합니다. (개인 커스텀 용)
- plugins 에는 js를 배열로 추가 할 수 있습니다.  

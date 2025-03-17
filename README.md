# todo
- This is a To-Do list for multiple users. Users' To-Do data is shared through a remote repository such as Git or SVN, without using a server or database. You can create and edit your own To-Do items, but you can only view other users' To-Do items.
다중 사용자를 위한 todo list 입니다.
- 사용자들의 todo data는 서버나 db를 사용하지 않고 git이나 svn같은 리모트 저장소로 공유합니다.
본인의 todo를 작성과 수정할 수 있고 다른 유저의 todo는 조회만 가능합니다.


## node 설치, 버전 확인
```
$ node -v
$ npm -v
```

## Node modules 설치 : package.json 에 있는 모듈들이 설치 됩니다.
```
$ npm install
```

# todo
- This is a To-Do list for multiple users. Users' To-Do data is shared through a remote repository such as Git or SVN, without using a server or database. You can create and edit your own To-Do items, but you can only view other users' To-Do items.
다중 사용자를 위한 todo list 입니다.
- 사용자들의 todo data는 서버나 db를 사용하지 않고 git이나 svn같은 리모트 저장소로 공유합니다.
본인의 todo를 작성과 수정할 수 있고 다른 유저의 todo는 조회만 가능합니다.


## node 설치, 버전 확인
```
$ node -v
$ npm -v
```

## Node modules 설치 : package.json 에 있는 모듈들이 설치 됩니다.
```
$ npm install
```

## 루트 디렉토리에 config.json 작성
```
{
    "system_settings": {
      "version": "1.0"
    },
    "theme" : "",
    "plugins" : [
      "ui.js"
    ],
    "users": [
      {
        "id": "2yunhan",
        "name": "yh2",
        "role": "master",
        "permissions": {
          "system_control": true,
          "user_management": true,
          "content_modification": true
        },
        "active": true
      },
      {
        "id": "metallica",
        "name": "kim teahyung",
        "role": "member",
        "permissions": {
          "system_control": false,
          "user_management": false,
          "content_modification": false
        },
        "active": true
      },
      {
        "id": "nice-guy",
        "name": "gilsub",
        "role": "member",
        "permissions": {
          "system_control": false,
          "user_management": false,
          "content_modification": true
        },
        "active": true
      }
    ],
    
    }
  }
```
각 user의 id, name, role 을 작성합니다.
본인의 id에는 role 이 master, 그 외에는 member입니다.

## express 서버 실행 : package.json 의 "script" 의 "start" 를 수행합니다.
```
$ npm start
```
- Execution Result: Check the service at localhost:3000
- Stop Server: Stop Express in the terminal using Ctrl + C
- Server Restart: Restart the server when modifying server.js
- 실행결과 : localhost:3000 로 서비스를 확인하세요.
- 서버 중지 : 터미널에서 Ctrl + C 로 express 중지 
- server.js 수정 시 서버 재 시작이 필요합니다.

## config.js
- Add config.js to .gitignore.
- Assign one of the users the role of master.
- Theme: Setting "dark" loads dark.css (for personal customization).
- Plugins: You can add JavaScript files as an array in plugins.
- config.js 는 gitignore 에 추가하세요.
- users 중 한명에게 role : master 로 지정 해 주세요.
- theme : "dark" => dark.css를 추가로 로드합니다. (개인 커스텀 용)
- plugins 에는 js를 배열로 추가 할 수 있습니다.  


## express 서버 실행 : package.json 의 "script" 의 "start" 를 수행합니다.
```
$ npm start
```
- Execution Result: Check the service at localhost:3000
- Stop Server: Stop Express in the terminal using Ctrl + C
- Server Restart: Restart the server when modifying server.js
- 실행결과 : localhost:3000 로 서비스를 확인하세요.
- 서버 중지 : 터미널에서 Ctrl + C 로 express 중지 
- server.js 수정 시 서버 재 시작이 필요합니다.

## config.js
- Add config.js to .gitignore.
- Assign one of the users the role of master.
- Theme: Setting "dark" loads dark.css (for personal customization).
- Plugins: You can add JavaScript files as an array in plugins.
- config.js 는 gitignore 에 추가하세요.
- users 중 한명에게 role : master 로 지정 해 주세요.
- theme : "dark" => dark.css를 추가로 로드합니다. (개인 커스텀 용)
- plugins 에는 js를 배열로 추가 할 수 있습니다.  

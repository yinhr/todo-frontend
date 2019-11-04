# todo-frontend
todo管理アプリのフロントエンド

## Description
Vue.jsを用いたtodo管理アプリのフロントエンドを実装  
バックエンドAPI([yinhr/todo-backend](https://github.com/yinhr/todo-backend))とtodo情報を通信し表示  
cssフレームワーク[tailwind](https://tailwindcss.com/)を用いたレスポンシブデザインに対応

## todo管理アプリ
以下参照 
[todo管理アプリについて](https://www.notion.so/prmcy/ToDo-14f83b283c4b4bd088ee9f11ebe5be13)

## 機能
* axiosを用いたAPIとの非同期通信
* vue-routerによるルーティング機能
* vuexによる状態管理
* ログイン状態管理

## Usage

### ディレクトリ構成
```
[project root]
├── client/ (yinhr/todo-frontend *このリポジトリ）
├── db/
│   ├── Dockerfile (下記Gist参照)
│   └── my.cnf (下記Gist参照)
├── nginx/ (yinhr/todo-nginx）
├── server/ (yinhr/todo-backend)
└── docker-compose.yml (下記Gist参照)
```
* [Dockerfile](https://gist.github.com/yinhr/3ff5456bc9859af9de7bde2923b84f94)
* [my.cnf](https://gist.github.com/yinhr/ee5fe7dc88831de8f5994447c89cff93)
* [docker-compose.yml](https://gist.github.com/yinhr/bfe1c20f700df5fca2a44ad18f7f3102)

### コンテナ起動
```
docker-compose up --build
```

### ブラウザで下記にアクセス
```
http://localhost:3000
```


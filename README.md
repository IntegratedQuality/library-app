# library-app

本の貸し借り管理アプリです

## 実行
```
npm install
docker-compose up -b
npm start
```
npm install はパッケージを更新していなければしなくて大丈夫です

## push する前に
src に移動してから(cd src)
```
npm run lint
```
をしてソースコードをきれいに保ちましょう

```
docker-compose up -b
```
を実行した後に
```
npm run test
```
をしてエラーやワーニングが出てないかチェック

# library-app

本の貸し借り管理アプリです

## 実行
```
docker-compose up -b
```
を実行した後に
```
npm start
```
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

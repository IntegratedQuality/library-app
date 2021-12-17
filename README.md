# library-app

本の貸し借り管理アプリです

## 実行
```
npm install
docker-compose up -d
npm start
```
npm install はパッケージを更新していなければしなくて大丈夫です

### For Windows
npm scriptで`cmd.exe`が動くと`$()`を解釈できません。powershell等に書き換えてください
```
npm config set script-shell powershell.exe
```

## push する前に
src に移動してから(cd src)
```
npm run lint
```
をしてソースコードをきれいに保ちましょう

```
docker-compose up -d
```
を実行した後に
```
npm run test
```
をしてエラーやワーニングが出てないかチェック

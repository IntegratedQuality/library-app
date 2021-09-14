#仕様書

## 外部仕様
システムでは、本の登録、本の貸出、本の返却を行うことが出来る。<br>
本の登録では、新たにサークルで本を購入した際に本を追加する機能である。<br>
本の貸出、返却では誰が本を借りたのか、そしていつ返却されたのかを登録することが出来る。<br>
登録、貸出、返却はアカウント管理を行い、ログイン中にのみ可能である。

## 内部仕様

### /(ルート)
#### GET(データを取得)
メインページとして、現在サークルとして管理している本一覧を見る事ができる<br>
本一覧から、レンタル可能不可能や、本の名前等で絞り込みをすることが出来るメインページから、本の貸出と返却の登録が行える

### /book
#### POST(データの登録)
本の登録をすることが出来る

### /book/{id}
#### GET(データを取得)
本の情報が表示される

### /books
#### GET(データを取得)
本を取得することが出来る クエリパラメータ指定

### /rent
#### PUT(データの更新)
本をレンタルすることが出来る

### /return
#### PUT(データの更新)
本を返却することが出来る

### /register
#### GET(データの取得)
本の登録を編集するページが表示される
### /rent ret/{user id}
#### GET(データの取得)
そのユーザーの本の履歴を取得できる

### /login
#### PUT(データの更新)
アカウントにログインする

### /signup
#### POST(データの登録)
アカウントを作成する

### /logout
#### PUT(データの更新)
ログアウトする

## データベース
### 本(テーブル名 book)

|id|本の識別子|int|false|increment|
|--|--|--|--|--|
|title|タイトル|string|false|なし|
|isbn|本の識別子|bigint|true|null|
|is\_rented|本が貸出中かどうか|boolean|false|false|


### ユーザー(テーブル名 user)
|名前|説明|型|nullable|default|
|--|--|--|--|--|
|id|ユーザーの識別子|string|false|なし|
|name|表示ユーザー名|string|false|なし|
|password|パスワード(ハッシュ化済み)|string|false|なし|

### 貸出履歴(テーブル名 rent\_ret\_history)
|名前|説明|型|nullable|default|
|--|--|--|--|--|
|book\_id|本の識別子|int|false|なし|
|rent\_time|貸出時間|datetime|false|なし|
|return\_time|返却時間|datetime|true|null|
|user\_id|貸し出したユーザー|string|false|なし|


## 技術選定
### デプロイ
heroku

### バックエンド
node + express

### データベース
MySQL

### フロントエンド
JavaScript<br>
ベースは生HTML + CSS + JS<br>
ガワを作った後に少しずつReact に書き換え

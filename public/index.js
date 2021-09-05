/**
 * MUST TODO
 * - [x] 個別ページへのリンクを張る
 * - [x] navbarの修正
 * - [x] ログイン画面
 * - [x] ユーザ登録画面
 * - [x] 本のレンタル処理
 * - [x] 本の登録処理
 * - [x] 本の返却処理
 * - [x] 本リスト読み込み時に目に悪そうな動きをするのを直す
 * - [x] 検索結果に件数を表示する
 * - [ ] えらーハンドリングをちゃんとやる
 * 
 * そのうちTODOになる
 * - [ ] ログイン処理
 * - [ ] ユーザ登録処理
 * - [ ] ユーザ情報更新処理
 * - [ ] 本の登録情報更新処理
 * - [ ] 本の登録削除しょり
 * - [ ] ユーザ情報画面 <= ログイン状態でSIGNIN/LOGINの代わりにリンクが表示されるようにする
 * 
 * HAD BETTER TODO
 * - [x] footer消す
 * - [ ] 登録修正のボタン配置をいい感じにする
 * - [ ] 自分が借りているか、他人が借りているか判定
 * - [ ] デザインをかっこよくする
 * - [ ] Reactに置き換える
 * - [ ] 配信ファイルのディレクトリ構成（サーバ側、クライアント側共に）
 * - [ ] レスポンシブにする（特に表やリスト状のもの）
 */
// 蔵書一覧の読み込み
document.addEventListener('DOMContentLoaded', async (e) => {

    const params = new URLSearchParams(document.location.search.substring(1));
    let pageNum = parseInt(params.get('page'));
    if (isNaN(pageNum)) {
        pageNum = 1;
        console.error("fail to parse page number (string -> number)");
    }
    const perPage = 5;
    const start = (pageNum - 1) * perPage;

    // 書籍データの取得
    const URI = `/api/v1/books?${new URLSearchParams({ start })}`;
    console.log("GET", URI);
    const t = await fetch(URI).catch(error => { console.error(error); });
    const u = await t.json().catch(error => {
        console.error(error);
        return { total: 0, error: error };
    });
    console.log(u);

    // 件数表示を描画
    document.getElementById('number-area').innerHTML = `<p><span class="fw-bold"> ${Math.min(u.total, start + 1)} </span> ～ <span class="fw-bold"> ${Math.min(u.total, start + perPage)} </span>件目／<span class="fw-bold"> ${u.total} </span>件中</p>`;

    // 書籍リストを描画
    if (u.error !== undefined) {
        document.getElementById('book-list-area').innerHTML += `<p class="lead pt-4 ps-3">検索結果の取得に失敗しました</p>`
        return false;
    } else {
        let booksHTML = '';
        for (bookData of u.list) {
            booksHTML += `<li class="list-group-item py-4 px-1"><div class="row"><a href="/book.html?id=${bookData.id}" class="text-decoration-none lead pb-2">${bookData.title}</a></div></li>`;
        }
        document.getElementById('book-list-area').innerHTML = booksHTML;
    }

    // paginationを描画
    maxPage = Math.floor(parseInt(u.total) / perPage) + 1;
    if (isNaN(maxPage)) {
        console.error("fail to parse page number");
    }

    for (pageArea of document.getElementsByClassName('page-area')) {

        let pageHTML = `<ul class="pagination">`;
        pageHTML += `<li class="page-item"><a class="page-link" href="http://localhost:3000/?page=${Math.max(1, pageNum - 1)}"><span aria-hidden="true">&laquo;</span></a></li>`

        for (let p = 1; p <= maxPage; p += 1) {
            pageHTML += `<li class="page-item ${p === pageNum ? 'active' : ''}"><a class="page-link" href="http://localhost:3000/?page=${p.toString()}">${p.toString()}</a></li>`
        }

        pageHTML += `<li class="page-item"><a class="page-link" href="http://localhost:3000/?page=${Math.min(maxPage, pageNum + 1)}"><span aria-hidden="true">&raquo;</span></a></li>`
        pageArea.innerHTML = pageHTML;
    }
}, false);







// TODO: ユーザIDを動的に取得する
// TODO: えらーはんどりんぐ
// TODO: ボタンの不可視化
// MEMO: 書籍データを結合しているところが重そう？

document.addEventListener('DOMContentLoaded', async (e) => {

    // 現在ユーザが借りている本の一覧を取得する
    const userID = 1;
    const start = 0;
    const URI = `/api/v1/user/${userID}/history?${new URLSearchParams({ start })}`;

    console.log('GET', URI)
    const t = await fetch(URI);
    const u = await t.json();

    console.log(u);
    const unreturedBooks = u.list.filter(x => x.return_time === null);
    console.log(unreturedBooks);

    // 貸出状態に基づいて描画する
    const target = document.getElementById('rent-list-area');
    let html = `<p class="">貸出中の資料：<span class="fw-bold">${unreturedBooks.length}</span>冊</p>`

    if (unreturedBooks.length === 0) {
        html += `<p>現在貸し出し中の資料はありません</p>`
        target.innerHTML = html;
        return;
    }

    html += `<table class="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th scope="col"></th>
                        <th scope="col">#</th>
                        <th scope="col">ISBN</th>
                        <th scope="col">返却期限</th>
                        <th scope="col">書名</th>
                    </tr>
            </thead>`;
    html += '<tbody>';
    for (const [i, rentData] of unreturedBooks.entries()) {
        console.log(i, rentData);
        // 書籍データの取得
        const URI = `/api/v1/book/${rentData.book_id}`;
        console.log("GET", URI);
        const t = await fetch(URI);
        const u = await t.json();
        console.log(u)

        // 取得に失敗したら描画しない

        // 書籍データの描画
        html += `<tr>
                    <th scope="col"><input id="table-row-${i}" class="return-checkbox" type="checkbox"></th>
                    <th scope="col">${i}</th>
                    <th scope="col">${u.isbn}</th>
                    <th scope="col">返却期限はないよ！</th>
                    <th scope="col"><a href="/book.html?id=${u.id}" class="text-decoration-none">${u.title}</a></th>
                </tr>`;
    }
    html += '</tbody>';
    html += '</table>';
    target.innerHTML = html;

}, false);

document.getElementById('return-button').addEventListener('click', async (e) => {
    // チェックボックスの内容に基づき、返却する本のIDのリストを取得する

    // すべてのIDの本を返却する（エラー処理に注意？）

}, false);
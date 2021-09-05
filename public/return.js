// TODO: ユーザIDを動的に取得する
// TODO: APIと相談しながら仕様を変えるかも
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
    
    // 貸出状態に基づいて描画する
    const unreturedBooks = u.list.filter(x => x.return_time === null);
    const target = document.getElementById('rent-list-area');
    let html = `<p class="">貸出中の資料：<span class="fw-bold">${unreturedBooks.length}</span>冊</p>`

    if (unreturedBooks.length === 0) {
        document.getElementById('return-text').setAttribute('class', 'collapse')
        document.getElementById('return-button').setAttribute('class', 'collapse')
        html += `<p>現在貸し出し中の資料はありません</p>`
        target.innerHTML = html;
        return;
    }

    html += `<table class="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th scope="col"></th>
                        <th scope="col">#</th>
                        <th scope="col" class="col-2">ISBN</th>
                        <th scope="col" class="col-3">返却期限</th>
                        <th scope="col" class="col-6">書名</th>
                    </tr>
            </thead>`;
    html += '<tbody>';
    for (const [i, rentData] of unreturedBooks.entries()) {
        // 書籍データの取得
        const URI = `/api/v1/book/${rentData.book_id}`;
        console.log("GET", URI);
        const t = await fetch(URI);

        // 取得に失敗したら描画しない
        if (t.status >= 400) {
            console.error(`ERROR: cannot get book data.`);
            continue;
        }
        const bookData = await t.json();
        console.log(bookData)

        // 書籍データの描画
        html += `<tr>
                    <td><input name="${bookData.id}" class="return-checkbox" type="checkbox"></th>
                    <td>${i}</th>
                    <td>${bookData.isbn}</th>
                    <td>yyyy-mm-dd</th>
                    <td><a href="/book.html?id=${bookData.id}" class="text-decoration-none">${bookData.title}</a></th>
                </tr>`;
    }
    html += '</tbody>';
    html += '</table>';
    target.innerHTML = html;

}, false);

document.getElementById('return-button').addEventListener('click', async (e) => {
    // チェックボックスの内容に基づき、返却する本のIDのリストを取得する
    const bookIDList = [];
    for (let box of document.getElementsByClassName('return-checkbox')) {
        if (box.checked) {
            bookIDList.push(box.name);
        }
    }

    // すべてのIDの本を返却する
    for (let bookID of bookIDList) {
        const URI = `/api/v1/book/${bookID}/return`;
        console.log('POST', URI);
        const t = await fetch(URI, { method: "POST" });
        if (t.status !== 204) {
            console.log(`ERROR: HTTP responce status is invalid.\n Expected 204 but ${t.status}.\n Fail to return book (id=${bookID}). Maybe wrong bookID is sent.`);
            continue;
        }
    }

    // デバッグするときは消そう！
    document.location.reload();

}, false);
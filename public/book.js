
document.addEventListener('DOMContentLoaded', async (e) => {

    // クエリの解析
    const params = new URLSearchParams(document.location.search.substring(1));
    // const URI = `/api/v1/book/${params.get('id')}`;
    const URI = `/api/v1/book/${params.get('id')}`;

    // API呼び出し
    console.log("GET", URI);
    const t = await fetch(URI).catch((error) => { console.err(error) });
    const u = await t.json().catch((error) => {
        console.error(error);
        document.getElementById('book-card-body').innerHTML = `<p>書誌情報の取得に失敗しました</p>`;
        return null;
    });
    console.log(u);

    if (u === null) {
        return;
    }

    // 書籍情報の描画
    let target = document.getElementById('book-details-area');
    console.log(target)
    html = `<dl class="row pb-3">
                <dt class="col-2">タイトル</dt>
                <dd class="col-10">${u.title}</dd>
                <dt class="col-2">ISBN</dt>
                <dd class="col-10">${u.isbn}</dd>
            </dl>`;
    if (u.is_rented) {
        html += `<p>現在貸し出し<span class="fw-bold"> 不可 </span>です</p>`;
        document.getElementById('rent-button').setAttribute('class', 'btn btn-primary disabled')
    } else {
        html += `<p>現在貸し出し<span class="fw-bold"> 可 </span>です</p>`;
    }
    target.innerHTML = html;

    document.getElementById('edit-button').setAttribute('href', `/edit.html?id=${u.id}`)

}, false);


document.getElementById('rent-button').addEventListener('click', async (e) => {
    e.preventDefault();

    const params = new URLSearchParams(document.location.search.substring(1));
    const URI = `/api/v1/book/${params.get('id')}/rent`;
    console.log('POST', URI);
    const t = await fetch(URI, { method: "POST" });
    if (t.status === 204) {
        console.log(`Status ${t.status}`);
        // ページの表示を更新する
        location.reload();
    } else {
        alert('貸出処理に失敗しました')
    }

}, false);
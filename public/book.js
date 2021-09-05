
document.addEventListener('DOMContentLoaded', async (e) => {

    const params = new URLSearchParams(document.location.search.substring(1));
    const URI = `/api/v1/book/${params.get('id')}`;

    console.log("GET", URI);
    const t = await fetch(URI);
    const u = await t.json();
    console.log(u);

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
    }

    const u = await t.json();
    console.log(JSON.stringify(u));
}, false);

document.addEventListener('DOMContentLoaded', async (e) => {

    const params = new URLSearchParams(document.location.search.substring(1));
    const URI = `/api/v1/book/${params.get('id')}`;

    console.log("GET", URI);
    const t = await fetch(URI);
    const u = await t.json();
    console.log(u);


    document.getElementById('input-isbn').setAttribute('value', u.isbn)
    document.getElementById('input-title').setAttribute('value', u.title)
}, false);

document.getElementById('update-button').addEventListener('click', async (e) => {
    // TODO: 更新処理の実装
});

document.getElementById('delete-button').addEventListener('click', async (e) => {
    // TODO: 削除処理の実装
});
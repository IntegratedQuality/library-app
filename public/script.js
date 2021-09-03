// 本の追加
// const addbook = document.getElementById('addbook');
// addbook.addEventListener('submit', async (e) => {
//     e.preventDefault();
//     const title = addbook.title.value;
//     const isbn = addbook.isbn.value;
//     const URI = `/api/v1/books`;
//     console.log("PUT", URI, { title, isbn });
//     const t = await fetch(URI, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, isbn }) });
//     const u = await t.json();
//     document.getElementById('addbookoutput').value = JSON.stringify(u);
// }, false);

// 蔵書一覧
const getform = document.getElementById('get');
getform.addEventListener('submit', async (e) => {
    e.preventDefault();
    const start = getform.start.value;
    const URI = `/api/v1/books?${new URLSearchParams({ start })}`;
    console.log("GET", URI);
    const t = await fetch(URI);
    const u = await t.json();
    document.getElementById('getoutput').value = JSON.stringify(u);
}, false);

/*
// 本の検索
const searchform = document.getElementById('search');
searchform.addEventListener('submit', async (e) => {
    e.preventDefault();
    const q = searchform.q.value;
    const start = searchform.start.value;
    const URI = `/api/v1/books/search?${new URLSearchParams({ q, start })}`;
    console.log("GET", URI);
    const t = await fetch(URI);
    const u = await t.json();
    document.getElementById('searchoutput').value = JSON.stringify(u);
}, false);

// 貸し借り
const bookform = document.getElementById('bookform');
document.getElementById('getbook').addEventListener('click', async () => {
    const t = await fetch(`/api/v1/book/${bookform.id.value}`);
    const u = await t.json();
    document.getElementById('kashioutput').value = JSON.stringify(u);
}, false);
document.getElementById('rent').addEventListener('click', async () => {
    const URI = `/api/v1/book/${bookform.id.value}/rent`;
    console.log('POST', URI);
    const t = await fetch(URI, { method: "POST" });
    if (t.status === 204) {
        document.getElementById('kashioutput').value = `Status ${t.status}`;
        return;
    }
    const u = await t.json();
    document.getElementById('kashioutput').value = JSON.stringify(u);
}, false);
document.getElementById('return').addEventListener('click', async () => {
    const URI = `/api/v1/book/${bookform.id.value}/return`;
    console.log('POST', URI);
    const t = await fetch(URI, { method: "POST" });
    if (t.status === 204) {
        document.getElementById('kashioutput').value = `Status ${t.status}`;
        return;
    }
    const u = await t.json();
    document.getElementById('kashioutput').value = JSON.stringify(u);
}, false);
document.getElementById('book_history').addEventListener('click', async () => {
    const start = bookform.start.value;
    const URI = `/api/v1/book/${bookform.id.value}/history?${new URLSearchParams({ start })}`;
    console.log('GET', URI)
    const t = await fetch(URI);
    const u = await t.json();
    document.getElementById('kashioutput').value = JSON.stringify(u);
}, false);

// ユーザ履歴
document.getElementById('getuserret').addEventListener('click', async () => {
    const start = document.getElementById("user_retrentstart").value;
    const URI = `/api/v1/user/${document.getElementById("user_id").value}/history?${new URLSearchParams({ start })}`;
    console.log('GET', URI)
    const t = await fetch(URI);
    const u = await t.json();
    document.getElementById('useroutput').value = JSON.stringify(u);
}, false);
//*/
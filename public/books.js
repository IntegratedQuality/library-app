const searchform = document.getElementById('search');
searchform.addEventListener('submit', async (e) => {
    e.preventDefault();
    const q = searchform.q.value;
    const start = 0;
    const URI = `/api/v1/books/search?${new URLSearchParams({ q, start })}`;
    console.log("GET", URI);
    // const t = await fetch(URI);
    // const u = await t.json();

    // 描画
    return false;
}, false);

for (pageLink of document.getElementsByClassName('page-link')) {
    const pageNum = parseInt(pageLink.textContent);
    if (isNaN(pageNum)) {
        continue;
    }

    pageLink.addEventListener('click', async (e) => {
        e.preventDefault();
        const URI = `/api/v1/books/search?${new URLSearchParams({ offset })}`;
        console.log("GET", URI);
        // const t = await fetch(URI);
        // const u = await t.json();

        // 描画

    });
}

// ページボタンの挙動
// for (const pageItem of document.getElementsByClassName('page-item')) {
//     pageItem.addEventListener('click', (e) => {
//         const newClass = pageItem.getAttribute('class') + ' active';
//         pageItem.setAttribute('class', newClass);
//     });
// }
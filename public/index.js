// TODO: books.jsとほとんど同じなので、うまくやる
// 蔵書一覧を取得する
document.addEventListener('onload', async (e) => {
    e.preventDefault();
    const start = 0;
    const URI = `/api/v1/books?${new URLSearchParams({ start })}`;
    console.log("GET", URI);
    const t = await fetch(URI);
    const u = await t.json();
    
    // 描画
    // document.getElementById('getoutput').value = JSON.stringify(u);
}, false);

// ページ遷移
for (pageLink of document.getElementsByClassName('page-link')) {
    const pageNum = parseInt(pageLink.textContent);
    if (isNaN(pageNum)) {
        continue;
    }

    pageLink.addEventListener('click', async (e) => {
        e.preventDefault();
        // const URI = `/api/v1/books?${new URLSearchParams({ offset })}`;
        // console.log("GET", URI);
        // const t = await fetch(URI);
        // const u = await t.json();

        // 描画

    });
}
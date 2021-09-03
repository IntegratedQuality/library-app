
// 蔵書一覧の読み込み
window.addEventListener('load', async (e) => {

    const params = new URLSearchParams(document.location.search.substring(1));
    const start = params.get('page') * 5;

    // 本データの読み込み
    const URI = `/api/v1/books?${new URLSearchParams({start})}`;
    console.log("GET", URI);
    const t = await fetch(URI);
    const u = await t.json();
    
    // 描画
    console.log(JSON.stringify(u));
    
}, false);

// ページ遷移イベントの設定
for (pageLink of document.getElementsByClassName('page-link')) {
    const pageNum = parseInt(pageLink.textContent);
    console.log(pageLink.textContent);
    // pagenation の実装がわかんな～～い

    pageLink.addEventListener('click', async (e) => {
        e.preventDefault();
        // const URI = `/api/v1/books?${new URLSearchParams({ offset })}`;
        // console.log("GET", URI);
        // const t = await fetch(URI);
        // const u = await t.json();

        // 描画

    });
}
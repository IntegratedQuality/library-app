
// 蔵書一覧の読み込み
window.addEventListener('load', async (e) => {

    const params = new URLSearchParams(document.location.search.substring(1));
    const pageNum = parseInt(params.get('page'));
    if (isNaN(pageNum)) {
        console.log("ERROR: fail to parse page number (string -> number). Maybe query string is invalid");
    }
    const start = pageNum * 5;

    // 書籍データの取得
    // const URI = `/api/v1/books?${new URLSearchParams({ start })}`;
    // console.log("GET", URI);
    // const t = await fetch(URI);
    // const u = await t.json();

    // 書籍リストを描画
    // console.log(JSON.stringify(u));

    // paginationの挿入
    maxPage = 10;

    for (pageArea of document.getElementsByClassName('page-area')) {

        let html = `<ul class="pagination">`;
        html += `<li class="page-item"><a class="page-link" href="http://localhost:3000/?page=${Math.max(1, pageNum - 1)}"><span aria-hidden="true">&laquo;</span></a></li>`

        for (let p = 1; p <= 10; p += 1) {
            html += `<li class="page-item ${p === pageNum ? 'active' : ''}"><a class="page-link" href="http://localhost:3000/?page=${p.toString()}">${p.toString()}</a></li>`
        }

        html += `<li class="page-item"><a class="page-link" href="http://localhost:3000/?page=${Math.min(maxPage, pageNum + 1)}"><span aria-hidden="true">&raquo;</span></a></li>`
        pageArea.innerHTML = html;
    }
}, false);







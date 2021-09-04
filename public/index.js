/**
 * TODO
 * - [ ] 個別ページへのリンクを張る
 */
// 蔵書一覧の読み込み
window.addEventListener('load', async (e) => {

    const params = new URLSearchParams(document.location.search.substring(1));
    let pageNum = parseInt(params.get('page'));
    if (isNaN(pageNum)) {
        pageNum = 1;
        console.log("ERROR: fail to parse page number (string -> number). Maybe query string is invalid");
    }
    const perPage = 5;
    const start = (pageNum - 1) * perPage;

    // 書籍データの取得
    const URI = `/api/v1/books?${new URLSearchParams({ start })}`;
    console.log("GET", URI);
    const t = await fetch(URI);
    const u = await t.json();

    // 書籍リストを描画
    let booksHTML = '';
    for (bookData of u.list) {
        booksHTML += `<li class="list-group-item py-4 px-1"><div class="row"><a href="#" class="text-decoration-none lead pb-2">${bookData.title}</a></div></li>`;
    }
    document.getElementById('book-list-area').innerHTML = booksHTML;

    // paginationを描画
    maxPage = Math.floor(parseInt(u.total) / perPage) + 1;
    if (isNaN(maxPage)) {
        console.log("ERROR: fail to parse page number (string -> number)");
    }

    for (pageArea of document.getElementsByClassName('page-area')) {

        let pageHTML = `<ul class="pagination">`;
        pageHTML += `<li class="page-item"><a class="page-link" href="http://localhost:3000/?page=${Math.max(1, pageNum - 1)}"><span aria-hidden="true">&laquo;</span></a></li>`

        for (let p = 1; p <= maxPage; p += 1) {
            pageHTML += `<li class="page-item ${p === pageNum ? 'active' : ''}"><a class="page-link" href="http://localhost:3000/?page=${p.toString()}">${p.toString()}</a></li>`
        }

        pageHTML += `<li class="page-item"><a class="page-link" href="http://localhost:3000/?page=${Math.min(maxPage, pageNum + 1)}"><span aria-hidden="true">&raquo;</span></a></li>`
        pageArea.innerHTML = pageHTML;
    }
}, false);







/**
 * TODO
 * - [ ] 個別ページへのリンクを張る
 */

window.addEventListener('load', async (e) => {

    // クエリ文字列の解析
    const params = new URLSearchParams(document.location.search.substring(1));
    let pageNum = parseInt(params.get('page'));
    if (isNaN(pageNum)) {
        pageNum = 1;
        console.log("ERROR: fail to parse page number (string -> number). Maybe query string is invalid");
    }
    const perPage = 5;
    const start = (pageNum - 1) * perPage;
    const q = params.get('q')
    if (q === null || q === undefined || q === '') {
        return false;
    }

    document.getElementById('search-input').setAttribute('value', q);

    // 書籍データの取得
    const URI = `/api/v1/books/search?${new URLSearchParams({ q, start })}`;
    console.log("GET", URI);
    const t = await fetch(URI);
    const u = await t.json();

    // 書籍リストを描画
    if (u.total === 0) {
        document.getElementById('book-list-area').innerHTML += `<p class="lead pt-4 ps-3">該当する書籍がありません</p>`
        return false;
    } else {
        let booksHTML = '';
        for (bookData of u.list) {
            booksHTML += `<li class="list-group-item py-4 px-1"><div class="row"><a href="/book.html?id=${bookData.id}" class="text-decoration-none lead pb-2">${bookData.title}</a></div></li>`;
        }
        document.getElementById('book-list-area').innerHTML = booksHTML;
    }

    // paginationを描画
    maxPage = Math.floor(parseInt(u.total) / perPage) + 1;
    if (isNaN(maxPage)) {
        console.log("ERROR: fail to parse page number (string -> number)");
    }

    for (pageArea of document.getElementsByClassName('page-area')) {

        let pageHTML = `<ul class="pagination">`;
        pageHTML += `<li class="page-item"><a class="page-link" href="http://localhost:3000/books.html?q=${q}&page=${Math.max(1, pageNum - 1)}"><span aria-hidden="true">&laquo;</span></a></li>`

        for (let p = 1; p <= maxPage; p += 1) {
            pageHTML += `<li class="page-item ${p === pageNum ? 'active' : ''}"><a class="page-link" href="http://localhost:3000/books.html?q=${q}&page=${p.toString()}">${p.toString()}</a></li>`
        }

        pageHTML += `<li class="page-item"><a class="page-link" href="http://localhost:3000/books.html?q=${q}&page=${Math.min(maxPage, pageNum + 1)}"><span aria-hidden="true">&raquo;</span></a></li>`
        pageArea.innerHTML = pageHTML;
    }
    
}, false);


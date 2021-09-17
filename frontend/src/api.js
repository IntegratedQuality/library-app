async function fetchSearchResults(q, start) {
    // 図書検索
    const URI = `/api/v1/books/search?${new URLSearchParams({ q, start })}`;
    console.log("GET", URI);

    // TODO: 適切なエラー処理
    const t = await fetch(URI);
    const u = await t.json();
    return u;
}

async function fetchBookData(bookID) {
    // 書誌情報
    const URI = `/api/v1/book/${bookID}`;
    console.log("GET", URI);

    //TODO: 適切なエラー処理
    const t = await fetch(URI);
    const u = await t.json();
    return u;
}

export { fetchSearchResults, fetchBookData };
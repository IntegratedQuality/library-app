const registerBook = document.getElementById('register-book');
registerBook.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = registerBook.title.value;
    const isbn = registerBook.isbn.value;

    /* TEST DATA (valid ISBN)
        4254275129
        aaa
    */

    console.log("title:", title);
    console.log("isbn:", isbn);

    const URI = `/api/v1/books`;
    console.log("PUT",URI,{title,isbn});

    const t = await fetch(URI,{method: 'PUT',headers: {'Content-Type': 'application/json'},body:JSON.stringify({title,isbn})});

    const u = await t.json();
    document.getElementById('addbookoutput').value=JSON.stringify(u);
}, false);
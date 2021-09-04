window.addEventListener('load', (e) => {
    const params = new URLSearchParams(document.location.search.substring(1));
    console.log(params.get(''));
}, false);
// TODO: ユーザIDを動的に取得する
document.addEventListener('DOMContentLoaded', async (e) => {
    // 現在そのユーザが借りている本の一覧を取得する
    const userID = 1;
    const start = 0;
    const URI = `/api/v1/user/${userID}/history?${new URLSearchParams({ start })}`;

    console.log('GET', URI)
    const t = await fetch(URI);
    const u = await t.json();

    console.log(u);
    const unreturedBooks = u.list.filter(x => x.return_time === null);
    console.log(unreturedBooks);


    // 描画する

}, false);

document.getElementById('return-button').addEventListener('click', async (e) => {
    // チェックボックスの内容に基づき、返却する本のIDのリストを取得する

    // すべてのIDの本を返却する（エラー処理に注意？）

}, false);
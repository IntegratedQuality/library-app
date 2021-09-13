const passportStub = require('passport-stub');
const request = require('supertest');
const app = require('../src/app');

const {initDetabase} = require('../src/util/accessdb');

const sendGet = async (uri, param, cookie) =>{
  let req = request(app).get(uri);

  return await req.send(param);
};
const sendPut = async (uri, param, cookie) =>{
  let req = request(app).put(uri);
  
  return await req.send(param);
};
const sendPost = async (uri, param, cookie) =>{
  let req = request(app).post(uri);
  
  return await req.send(param);
};

//Util
const getNumberOfBooks = async (x) => (await sendGet('/api/v1/books')).body.total;



beforeEach(async ()=> await request(app)
  .post('/api/v1/book/1/return')
  .send()
);


describe('本の取得テスト', ()=>{
  test('本の一覧が取得できる', async ()=>{
    const res = (await sendGet('/api/v1/books')).body;
    expect(typeof res.total).toBe('number');
    expect(typeof res.perpage).toBe('number');
    expect(Array.isArray(res.list)).toBeTruthy();
  });
  test('本が取得できる', async ()=>{
    const res = (await sendGet('/api/v1/book/1')).body;
    expect(typeof res.id).toBe('number');
    expect(typeof res.title).toBe('string');
    expect(typeof res.isbn).toBe('string');
    expect(typeof res.is_rented).toBe('boolean');
  });
  test('無い本が取得できない', async ()=>{
    const response = await sendGet('/api/v1/book/0');
    expect(response.status).toBe(404);
  });
  test('本が検索できる', async ()=>{
    const res = (await sendGet('/api/v1/books/search',{q:'Wiki'})).body;
    expect(typeof res.total).toBe('number');
    expect(typeof res.perpage).toBe('number');
    expect(Array.isArray(res.list)).toBeTruthy();
    for(let x of res.list){
      expect(x.title.indexOf('Wiki')).not.toBe(-1);
    }
  });
  test('無い本がみつからない', async ()=>{
    const res = (await sendGet('/api/v1/book/1')).body;
    expect(typeof res.id).toBe('number');
    expect(typeof res.title).toBe('string');
    expect(typeof res.isbn).toBe('string');
    expect(typeof res.is_rented).toBe('boolean');
  });
});

describe('本の追加テスト', ()=>{
  test('本を追加できる',async ()=>{
    const total = await getNumberOfBooks();
    const putres = await sendPut('/api/v1/books', {
      'title': 'マスタリングTCP/IP IPv6編',
      'isbn':'4274065855'
    });
    expect(putres.body.id).toBe(total+1);
    const total_after = await getNumberOfBooks();
    expect(total_after).toBe(total+1);
  });
  test('ISBNが不正な本を追加できない',async ()=>{
    const total =  await getNumberOfBooks();
    const putres = await sendPut('/api/v1/books',{
      'title': 'マスタリングTCP/IP IPv6編',
      'isbn':'4274065856'
    });
    expect(putres.status).toBe(400);
    const total_after =  await getNumberOfBooks();
    expect(total_after).toBe(total);
  });
  test('すでに登録済みのISBNでは追加できない',async ()=>{
    const total =  await getNumberOfBooks();
    const putres = await sendPut('/api/v1/books', {
      'title': 'Wikipediaの例示',
      'isbn':'9783161484100'
    });
    expect(putres.status).toBe(409);
    const total_after =  await getNumberOfBooks();
    expect(total_after).toBe(total);
  });
});

describe('本の貸し出しテスト', ()=>{
  let session;
  beforeAll(async()=>{
    initDetabase();
    passportStub.install(app);
    passportStub.login({
      user_id: 1,
      user_name: 'c-gengo-kun',
    });
  });
  test('本を貸し借りできる',async ()=>{
    //貸出数
    const total = (await sendGet('/api/v1/user/1/history',{}, session)).body.total;
    //確認
    const res_info = await sendGet('/api/v1/book/1');
    expect(res_info.body.is_rented).toBeFalsy();
    //貸し出し
    const res_rent = await sendPost('/api/v1/book/1/rent');
    expect(res_rent.status).toBe(204);
    //確認
    const res_info2 = await sendGet('/api/v1/book/1');
    expect(res_info2.body.is_rented).toBeTruthy();
    //貸出数の増加
    const res_retrent2 = await sendGet('/api/v1/user/1/history', session);
    expect(typeof res_retrent2.body.list[0].user_id).toBe('number');
    expect(res_retrent2.body.list[0].rent_time).not.toBeNull();
    expect(res_retrent2.body.list[0].return_time).toBeNull();
    expect(res_retrent2.body.total).toBe(total+1);
    //返却
    const res_return = await sendPost('/api/v1/book/1/return');
    expect(res_return.status).toBe(204);
    //確認
    const res_info3 = await sendGet('/api/v1/book/1');
    expect(res_info3.body.is_rented).toBeFalsy();
    //貸出関係図のnull埋め
    const res_retrent3 = await sendGet('/api/v1/user/1/history');
    expect(res_retrent3.body.list[0].return_time).not.toBeNull();
  });
  test('無い本は貸せない',async ()=>{
    //貸し出し
    const res_rent = await sendPost('/api/v1/book/0/rent');
    expect(res_rent.status).toBe(404);
  });
  test('借りられてない本は返せない',async ()=>{
    //返却
    const res_return = await sendPost('/api/v1/book/1/return');
    expect(res_return.status).toBe(409);
  });
  test('貸出中の本は貸せない',async ()=>{
    //貸し出し
    await sendPost('/api/v1/book/1/rent');
    passportStub.login({
      user_id: 2,
      user_name: 'meijiro-kun',
    });
    //貸し出し
    const res_rent2 = await sendPost('/api/v1/book/1/rent');
    expect(res_rent2.status).toBe(409);
    await sendPost('/api/v1/book/1/return');
  });
  test('貸出中の本を他人が返せない',async ()=>{
    //貸し出し
    await sendPost('/api/v1/book/1/rent');
    passportStub.login({
      user_id: 2,
      user_name: 'meijiro-kun',
    });
    //貸し出し
    const res_rent2 = await sendPost('/api/v1/book/1/return');
    expect(res_rent2.status).toBe(409);
  });

});

describe('本の貸し出し状況取得', ()=>{
  let session;
  beforeAll(async()=>{
    initDetabase();
    passportStub.install(app);
    passportStub.login({
      user_id: 1,
      user_name: 'c-gengo-kun',
    });
  });
  test('本の貸し出し状況を取得できる',async ()=>{
    //確認
    const res_getbookhistory = await sendGet('/api/v1/book/1/history', {}, session);
    const total = res_getbookhistory.body.total;
    const res_getuserhistory = await sendGet('/api/v1/user/1/history', {}, session);
    const user_total = res_getuserhistory.body.total;
    //貸し出し
    await request(app)
      .post('/api/v1/book/1/rent')
      .send();
    //確認
    const res_getbookhistory2 = await sendGet('/api/v1/book/1/history', {}, session);
    const total2 = res_getbookhistory2.body.total;
    expect(total2).toBe(total+1);
    const res_getuserhistory2 = await sendGet('/api/v1/user/1/history', {}, session);
    const user_total2 = res_getuserhistory2.body.total;
    expect(user_total2).toBe(user_total+1);
  });
  test('非ログインユーザの情報は取得できない',async ()=>{
    //確認
    const res_getbookhistory = await sendGet('/api/v1/user/2/history', {}, session);
    expect(res_getbookhistory.status).toBe(403);
  });
});

/**[TODO] ユーザアクセス権等
 * ログイン周辺に目処が立ってからテストを付け足す
 */

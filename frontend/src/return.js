import React from 'react';
export default class ReturnPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 200,
      borrowing: [],
    }
  }

  async updateBorrowingData() {
    const userID = 1;
    const start = 0;
    const URI = `/api/v1/user/${userID}/history?${new URLSearchParams({ start })}`;

    // 貸し出し情報の取得
    console.log('GET', URI)
    const res = await fetch(URI);
    const u = await res.json().catch(error => {
      console.error(error);
      return {
        list: [],
        perPage: 5,
        total: 0,
      };
    });

    // 貸し出し情報と本のタイトル、ISBNを紐付ける
    const borrowing = [];
    for (const record of u.list.filter(r => r.return_time === null)) {
      const URI = `/api/v1/book/${record.book_id}`;
      console.log("GET", URI);
      const res = await fetch(URI);

      if (res.status >= 400) {
        // 取得に失敗した！
        console.error(`cannot get book data.`);
        record.title = "";
        record.isbn = "";
        record.checked = false;
      } else {
        const bookData = await res.json();
        // TODO: catch
        record.title = bookData.title;
        record.isbn = bookData.isbn;
        record.checked = false;
      }
      borrowing.push(record);
    }

    this.setState({ borrowing });
  }

  handleChange(i) {
    const borrowing = this.state.borrowing.slice();
    borrowing[i].checked = !borrowing[i].checked;
    this.setState({ borrowing });
  }

  async handleClick() {
    const failedBookList = [];
    for (const record of this.state.borrowing.filter(r => r.checked)) {
      const URI = `/api/v1/book/${record.book_id}/return`;
      console.log('POST', URI);
      const t = await fetch(URI, { method: "POST" });
      if (t.status >= 400) {
        failedBookList.push(record.book_id);
      }
    }

    if (failedBookList.length > 0) {
      alert(`以下の本の返却に失敗しました。id = ${failedBookList.toString()}`);
    }

    this.updateBorrowingData();
  }

  componentDidMount() {
    this.updateBorrowingData();
  }

  render() {
    const circulation = (<p>貸出中の資料：<span className="fw-bold"> {this.state.borrowing.length} </span>冊</p>)

    const tableBody = this.state.borrowing.map((record, key) => {
      return (
        <tr key={key}>
          <td><input name="${bookData.id}" className="return-checkbox" type="checkbox" onChange={() => this.handleChange(key)} checked={this.state.borrowing[key].checked} /></td>
          <td>{key}</td>
          <td>{record.isbn}</td>
          <td>yyyy-mm-dd</td>
          <td><a href="/book.html?id=${bookData.id}" className="text-decoration-none">{record.title}</a></td>
        </tr>
      );
    })

    if (this.state.status >= 400) {
      return (
        <article className="col-8">
          <p className="display-5 pb-3">利用状況</p>
          <p>貸出情報の取得に失敗しました</p>
        </article>
      );
    } else if (this.state.borrowing.length === 0) {
      return (
        <article className="col-8">
          <p className="display-5 pb-3">利用状況</p>
          <p>現在貸し出し中の資料はありません</p>
        </article>
      );
    } else {
      return (
        <article className="col-8">
          <p className="display-5 pb-3">利用状況</p>
          {circulation}
          <div id="rent-list-area">
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th scope="col"></th>
                  <th scope="col">#</th>
                  <th scope="col" className="col-2">ISBN</th>
                  <th scope="col" className="col-3">返却期限</th>
                  <th scope="col" className="col-6">書名</th>
                </tr>
              </thead>
              <tbody>
                {tableBody}
              </tbody>
            </table>
          </div>
          <p id="return-text" className="small mt-4 mb-2">チェックを入れた本がすべて返却されます。</p>
          <button id="return-button" className="btn btn-primary" onClick={() => this.handleClick()}>返却</button>
        </article>
      );
    }
  }
};
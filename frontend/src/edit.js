import React from 'react';
import { fetchBookData } from './api.js';
export default class EditPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 1,
      title: "",
      isbn: "",
    }
    this.handleChangeTitle = this.handleChangeTitle.bind(this);
    this.handleChangeISBN = this.handleChangeISBN.bind(this);
    this.handleClickUpdate = this.handleClickUpdate.bind(this);
    this.handleClickDlelte = this.handleClickDelete.bind(this);
  }

  async updateBookData() {
    const book = await fetchBookData(this.props.id);
    this.setState({ title: book.title, isbn: book.isbn })
  }

  handleChangeTitle(event) {
    this.setState({ title: event.target.value });
  }

  handleChangeISBN(event) {
    this.setState({ isbn: event.target.value });
  }

  async handleClickUpdate(event) {
    event.preventDefault();

    const URI = `/api/v1/book/${this.props.id}/edit`;
    const reqBody = { title: this.state.title, isbn: this.state.isbn };
    console.log("POST", URI);
    const t = await fetch(URI, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(reqBody) });

    if (t.status >= 400) {
      alert('登録情報の更新に失敗しました');
    } else {
      alert('登録情報の更新に成功しました')
    }
  }

  async handleClickDelete(event) {
    event.preventDefault();
    // まだAPIがない
  }

  componentDidMount() {
    this.updateBookData();
  }

  render() {
    return (
      <article className="col-8">
        <p className="display-5 pb-3">登録情報の修正</p>
        <form action="/register" method="post">
          <div className="input-group pb-3">
            <span className="input-group-text">ISBN</span>
            <input
              id="input-isbn"
              className="form-control"
              name="isbn"
              type="text"
              value={this.state.isbn}
              onChange={this.handleChangeISBN}
              placeholder="ISBNを入力" />
          </div>
          <div className="input-group pb-3">
            <span className="input-group-text">Title</span>
            <input
              id="input-title"
              className="form-control"
              name="title"
              type="text"
              value={this.state.title}
              onChange={this.handleChangeTitle}
              placeholder="本のタイトルを入力" />
          </div>
        </form>
        <div className="d-flex justify-content-between">

          <button id="delete-button" className="btn btn-danger" onClick={this.handleClickDelete}>本を削除</button>
          <button id="update-button" className="btn btn-primary" onClick={this.handleClickUpdate}>更新</button>
        </div>
      </article>
    );
  }
};
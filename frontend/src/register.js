import React from 'react';
export default class RegisterPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isbn: "4254275129",
      title: "aaa",
    };
    this.handleChangeTitle = this.handleChangeTitle.bind(this);
    this.handleChangeISBN = this.handleChangeISBN.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChangeTitle(event) {
    // まとめたい
    this.setState({title: event.target.value});
  }

  handleChangeISBN(event) {
    this.setState({isbn: event.target.value});
  }

  async handleSubmit(event) {
    console.log('handle-submit', this);
    event.preventDefault();

    const URI = `/api/v1/books`;
    console.log("PUT", URI, { title: this.state.title, isbn: this.state.isbn });

    const t = await fetch(URI, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: this.state.title, isbn: this.state.isbn }) });

    if (t.status >= 400) {
      alert('本の登録に失敗しました');
    }

    const u = await t.json().catch(error => { console.error(error); });
    console.log(JSON.stringify(u));
  }

  render() {
    return (
      <article className="col-8">
        <p className="display-5 pb-3">本の登録</p>
        <form id="register-book" action="/register" method="post" onSubmit={this.handleSubmit}>
          <div className="input-group pb-3">
            <span className="input-group-text" id="basic-addon1">ISBN</span>
            <input
              id="input-isbn"
              className="form-control"
              name="isbn"
              type="text"
              value={this.state.isbn}
              placeholder="ISBNを入力"
              onChange={this.handleChangeISBN}
              required
            />
          </div>
          <div className="input-group pb-3">
            <span className="input-group-text" id="basic-addon1">Title</span>
            <input
              id="input-title"
              className="form-control"
              name="title"
              type="text"
              value={this.state.title}
              placeholder="本のタイトルを入力"
              onChange={this.handleChangeTitle}
              required
            />
          </div>
          <button id="register-button" type="submit" className="btn btn-primary">登録</button>
        </form>
      </article>
    );
  }
};
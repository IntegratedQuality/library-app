import React from 'react';
import { fetchBookData } from './api.js';
export default class BookDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      book: {
        id: 1,
        is_rented: true,
        isbn: "",
        title: "",
      },
    }
  }

  async updateBookData() {
    const book = await fetchBookData(this.props.id);
    this.setState({ book })
  }

  componentDidMount() {
    this.updateBookData();
  }

  async handleClick() {
    const URI = `/api/v1/book/${this.props.id}/rent`;
    console.log('POST', URI);
    const t = await fetch(URI, { method: "POST" });
    if (t.status !== 204) {
      alert('貸出処理に失敗しました')
    }
    this.updateBookData();
  }

  render() {
    return (
      <article className="col-8">
        <div className="card">
          <div className="card-header">書誌詳細</div>
          <div id="book-card-body" className="card-body">
            <div id="book-details-area" className="row">
              <dl className="row pb-3">
                <dt className="col-2">タイトル</dt>
                <dd className="col-10">{this.state.book.title}</dd>
                <dt className="col-2">ISBN</dt>
                <dd className="col-10">{this.state.book.isbn}</dd>
              </dl>
            </div>
            <p>現在貸し出し<span className="fw-bold"> {this.state.book.is_rented ? '不可' : '可'} </span>です</p>
            <button id="rent-button" className={'btn btn-primary ' + (this.state.book.is_rented ? 'disabled' : '')} onClick={() => this.handleClick()}>
              借りる
            </button>
            <a id="edit-button" className="btn btn-secondary" href="#" onClick={() => this.props.onSwitchMainContent({ name: 'edit', bookId: this.props.id })}>
              登録情報の変更
            </a>
          </div>
        </div>
      </article>
    );
  }
};
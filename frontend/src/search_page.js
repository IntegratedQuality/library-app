import React from 'react';
import { fetchSearchResults } from './api.js';
import Pagination from './pagination.js';
import BookList from './book_list.js';

export default class SearchPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      unsearched: true,
      query: "",
      pageNum: 0,
      status: 200,
      books: {
        total: 0,
        perpage: 5,
        list: [],
      },
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setPageNum = this.setPageNum.bind(this);
  }

  handleChange(event) {
    this.setState({ query: event.target.value });
  }

  async updateBookData(q, start) {
    if (this.state.query === "") {
      return;
    }
    const books = await fetchSearchResults(q, start);
    this.setState({ books });
  }

  async handleSubmit(event) {
    event.preventDefault();
    if (this.state.query === "") {
      return;
    }
    // 検索結果の取得
    const start = 0;
    const q = this.state.query;
    await this.updateBookData(q, start);
    this.setState({ pageNum: 0, unsearched: false});
  }

  setPageNum(calcNewPage) {
    const newPage = calcNewPage(this.state.pageNum);
    this.setState({ pageNum: newPage });
    const start = newPage * this.state.books.perpage;
    this.updateBookData(this.state.query, start);
  }

  render() {
    // 件数表示
    const start = Math.min(this.state.books.total, this.state.pageNum * this.state.books.perpage + 1);
    const end = Math.min((this.state.pageNum + 1) * this.state.books.perpage, this.state.books.total);
    const numberElement = (
      <div id="number-area" className="row mb-2">
        <p>
          <span className="fw-bold"> {start} </span>～<span className="fw-bold"> {end} </span>件目／<span className="fw-bold"> {this.state.books.total} </span>件中
        </p>
      </div>
    );

    const pageCount = Math.ceil(this.state.books.total / this.state.books.perpage);

    const searchForm = (
      <form id="search-form" action="/books.html" method="get" className="mb-4" onSubmit={this.handleSubmit}>
        <div className="input-group">
          <input
            id="search-input"
            className="form-control"
            name="q"
            type="search"
            onChange={this.handleChange}
            placeholder="蔵書から検索" />
          <button type="submit" className="btn btn-primary">検索</button>
        </div>
      </form>
    );

    if (this.state.status >= 400) {
      return (
        <article className="col-8">
          <p className="display-5 pb-3">検索</p>
          {searchForm}
          <p className="lead pt-4 ps-3">検索結果の取得に失敗しました</p>
        </article>
      );
    } else if (this.state.unsearched) {
      return (
        <article className="col-8">
          <p className="display-5 pb-3">検索</p>
          {searchForm}
        </article>
      );
    } else if (this.state.books.total === 0) {
      return (
        <article className="col-8">
          <p className="display-5 pb-3">検索</p>
          {searchForm}
          <p className="lead pt-4 ps-3">該当する書籍がありません</p>
        </article>
      );
    } else {
      return (
        <article className="col-8">
          <p className="display-5 pb-3">検索</p>
          {searchForm}
          {numberElement}
          <Pagination
            maxPage={pageCount}
            pageNum={this.state.pageNum}
            setPageNum={this.setPageNum}
          />
          <BookList books={this.state.books} onSwitchMainContent={this.props.onSwitchMainContent} />
          <Pagination
            maxPage={pageCount}
            pageNum={this.state.pageNum}
            setPageNum={this.setPageNum}
          />
        </article>
      );
    }
  }
};
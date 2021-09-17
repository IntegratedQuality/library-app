import React from 'react';
import { fetchSearchResults } from './api.js';
import Pagination from './pagination.js';
import BookList from './book_list.js';

export default class BookCatalogue extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      books: {
        list: [],
        total: 0,
        perpage: 5,
      },
      pageNum: 0,
      unfetched: true,
    };
    this.setPageNum = this.setPageNum.bind(this);
  }

  async updateBookData(pageNum) {
    const start = pageNum * this.state.books.perpage;
    const books = await fetchSearchResults("", start);
    this.setState({ books, unfetched: false });
  }

  componentDidMount() {
    this.updateBookData(0);
  }

  setPageNum(calcNewPage) {
    // ページの代入・増減の両方に対応するため、関数を渡す形式にした
    const newPage = calcNewPage(this.state.pageNum);
    this.setState({ pageNum: newPage });
    this.updateBookData(newPage);
  }

  render() {
    // 件数表示
    const start = Math.min(this.state.books.total, this.state.pageNum * this.state.books.perpage + 1);
    const limit = Math.min((this.state.pageNum + 1) * this.state.books.perpage, this.state.books.total);
    const numberElement = (
      <div id="number-area" className="row mb-2">
        <p>
          <span className="fw-bold"> {start} </span>～<span className="fw-bold"> {limit} </span>件目／<span className="fw-bold"> {this.state.books.total} </span>件中
        </p>
      </div>
    );

    const pageCount = Math.ceil(this.state.books.total / this.state.books.perpage);

    if (this.state.status >= 400) {
      return (
        <article className="col-8">
          <p className="display-5 pb-4">蔵書一覧</p>
          <p className="lead pt-4 ps-3">検索結果の取得に失敗しました</p>
        </article>
      );
    } else if (this.state.unfetched || true && false) {
      return (
        <article className="col-8">
          <p className="display-5 pb-4">蔵書一覧</p>
        </article>
      );
    } else if (this.state.books.total === 0) {
      return (
        <article className="col-8">
          <p className="display-5 pb-4">蔵書一覧</p>
          <p className="lead pt-4 ps-3">該当する書籍がありません</p>
        </article>
      );
    } else {
      return (
        <article className="col-8">
          <p className="display-5 pb-4">蔵書一覧</p>
          <div id="number-area" className="row mb-2">
            {numberElement}
          </div>
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
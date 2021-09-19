import React from 'react';
export default class Pagination extends React.Component {
  constructor(props) {
    super(props);
  }

  pageItem(key, msg, onClick) {
    return (
      <li
        className={"page-item " + (this.props.pageNum == key ? "active" : "")}
        onClick={onClick}
        key={key}
      >
        <a className="page-link">
          <span aria-hidden>{msg}</span>
        </a>
      </li>
    );
  }

  render() {
    // 表示は1-indexed, 内部的には0-indexed

    const pages = [...Array(this.props.maxPage).keys()].map((key) => {
      return this.pageItem(key, key + 1, this.props.setPageNum.bind(null, (p) => key))
    });

    return (
      <nav>
        <ul className="pagination">
          {this.pageItem('larrow', '«', this.props.setPageNum.bind(null, (p) => Math.max(0, p - 1)))}
          {pages}
          {this.pageItem('rarrow', '»', this.props.setPageNum.bind(null, (p) => Math.min(Math.max(0, this.props.maxPage - 1), p + 1)))}
        </ul>
      </nav>
    );
  }
};
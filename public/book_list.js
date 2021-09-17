class BookList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const bookList = this.props.books.list.map((book, key) => {
      return (
        <li
          className="list-group-item py-4 px-1"
          key={key}
          onClick={() => this.props.onSwitchMainContent({ name: "book", bookId: book.id })}
        >
          <div className="row">
            <a href="#" className="text-decoration-none lead pb-2">
              {book.title}
            </a>
          </div>
        </li>
      )
    });

    return (
      <ul id="book-list-area" className="list-group list-group-flush">
        {bookList}
      </ul>
    );
  }
}
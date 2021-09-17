class LibraryApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: {
        name: "top",
      },
    }
    this.handleSwitchMainContent = this.handleSwitchMainContent.bind(this);
  }

  handleSwitchMainContent(page) {
    this.setState({ page });
  }

  render() {
    const mainContent = (() => {
      switch (this.state.page.name) {
        case "top":
          return <BookCatalogue onSwitchMainContent={this.handleSwitchMainContent} />
        case "search":
          return <SearchPage onSwitchMainContent={this.handleSwitchMainContent} />
        case "info":
          return <Information />
        case "return":
          return <ReturnPage />
        case "register":
          return <RegisterPage />
        case "book":
          return <BookDetail id={this.state.page.bookId} onSwitchMainContent={this.handleSwitchMainContent} />
        case "edit":
          return <EditPage id={this.state.page.bookId} />
      }
    })();

    return (
      <div>
        <NavigationBar />
        <div className="container-fluid mt-5 pb-5">
          <div className="row">
            <Sidebar currentPage={this.state.page} onSwitchMainContent={this.handleSwitchMainContent} />
            {mainContent}
          </div>
        </div>
      </div>
    );
  }
}
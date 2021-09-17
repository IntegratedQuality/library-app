class NavigationBar extends React.Component {
  constructor(props) {
    super(props);
  }
  // style="background-color: rgb(48, 23, 158);"
  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-dark"
      >
        <div className="container-fluid">
          <a href="/" className="navbar-brand h1 mb-0 fs-2 text-white">IQ-OPAC</a>
          <div className="d-flex">
            <a href="/login.html" className="btn btn-outline-success text-white mx-2" aria-current="page">
              LOGIN
            </a>
            <a href="/signup.html" className="btn btn-warning text-white">
              SIGN UP
            </a>
          </div>
        </div>
      </nav>
    );
  }
}
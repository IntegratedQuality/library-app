import React from 'react';
export default class Sidebar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    // ページ名と表示するメッセージの対応
    const items = [
      { name: "top", description: "トップページ" },
      { name: "info", description: "このサイトについて" },
      { name: "search", description: "本を探す" },
      { name: "return", description: "本を返す" },
      { name: "register", description: "本を登録する" },
    ];

    // Sidebar の中身を構築する
    const sidebarListItems = items.map((item, key) => {
      return (
        <a
            href="#"
            key={key}
            className={"list-group-item list-group-item-action " + (this.props.currentPage.name === item.name ? "active" : "")}
            onClick={() => this.props.onSwitchMainContent({name: item.name})}
        >
          {item.description}
        </a>
      );
    });
    return (
      <aside className="sidebar col-3">
        <div className="list-group">
          {sidebarListItems}
        </div>
        {this.props.currentPage.name}
      </aside>
    )
  }
};
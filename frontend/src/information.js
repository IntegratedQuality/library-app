import React from 'react';
export default function Information() {
  return (
    <article className="col-8">
      <h4 className="display-6 pb-3">これはなに？</h4>
      <p className="fs-5 pb-5">明治大学公認のコンピュータ系サークル「IntegratedQuality」のWeb制作班による制作物（予定）です。部室内の書籍の貸し借りを管理します。</p>
      <h4 className="display-6 pb-3">本を借りたい</h4>
      <p className="fs-5 pb-5">ログインした後、各書籍の個別ページからレンタルすることが出来ます。書籍を見つけるために検索機能が利用できます。</p>
      <h4 className="display-6 pb-3">本を返却したい</h4>
      <p className="fs-5 pb-5">「本を返す」ページから出来ます。</p>
      <h4 className="display-6 pb-3">本を寄贈したい</h4>
      <p className="fs-5 pb-5">ありがとう</p>
      <h4 className="display-6 pb-3">本の登録情報を変更したい</h4>
      <p className="fs-5 pb-5">各書籍の個別ページから出来ます。</p>
    </article>
  );
};
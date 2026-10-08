// 教材用の悪い例：画面のすべてを、1つのコンポーネントに書いている。
// どこが困るかは、解説ページの本文で考える（ここには答えを書かない）。
import { countByCategory, initialItems } from '../items';

export function AllInOne() {
  const items = initialItems;
  const lentItems = items.filter((item) => item.lentTo !== null);

  return (
    <div>
      <p className="loan-summary">
        <span className="badge badge-book">本</span> {countByCategory(items, 'book')}件・
        <span className="badge badge-equipment">備品</span> {countByCategory(items, 'equipment')}件
      </p>
      <table>
        <thead>
          <tr>
            <th>名前</th>
            <th>種類</th>
            <th>状態</th>
            <th>借りている人</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>
                {item.category === 'book' ? (
                  <span className="badge badge-book">本</span>
                ) : (
                  <span className="badge badge-equipment">備品</span>
                )}
              </td>
              <td>{item.lentTo !== null ? '貸出中' : '貸出できます'}</td>
              <td>{item.lentTo !== null ? `${item.lentTo}さん` : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>いま貸出中のもの：</p>
      <ul>
        {lentItems.map((item) => (
          <li key={item.id}>
            {item.name}（{item.category === 'book' ? '本' : '備品'}）— {item.lentTo}さん
          </li>
        ))}
      </ul>
    </div>
  );
}

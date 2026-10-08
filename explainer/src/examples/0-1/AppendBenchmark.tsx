import { useRef, useState } from 'react';
import {
  appendOneByOne,
  appendWithFragment,
  appendWithLayoutRead,
  makeItems,
  measure,
  type Item,
} from './appendRows';

type Method = {
  label: string;
  append: (tbody: HTMLElement, items: readonly Item[]) => void;
};

const METHODS: readonly Method[] = [
  { label: '方法1：1行ずつ追加', append: appendOneByOne },
  { label: '方法2：まとめて追加', append: appendWithFragment },
  { label: '方法3：1行ずつ追加し、毎回高さを読む', append: appendWithLayoutRead },
];

const ITEMS = makeItems(1000);

type Result = { label: string; ms: number };

// 1000行の追加にかかる時間を、3つの方法で測って比べる。
export function AppendBenchmark() {
  const tbodyRef = useRef<HTMLTableSectionElement>(null);
  const [results, setResults] = useState<Result[]>([]);

  function run(method: Method) {
    const tbody = tbodyRef.current;
    if (tbody === null) return;

    // 1000行の表は、Reactを通さずに素のDOM操作で作る（測りたいのがDOM操作そのものだから）。
    tbody.replaceChildren();
    const ms = measure(() => method.append(tbody, ITEMS));
    setResults([...results, { label: method.label, ms }]);
  }

  return (
    <figure className="box live-example">
      <figcaption className="box-label">動かしてみよう（ボタンを押すたびに、表を空にしてから1000行を追加します）</figcaption>

      <table>
        <thead>
          <tr>
            <th>方法</th>
            <th>かかった時間（押した回ごと）</th>
          </tr>
        </thead>
        <tbody>
          {METHODS.map((method) => (
            <tr key={method.label}>
              <td>
                <button type="button" onClick={() => run(method)}>
                  {method.label}
                </button>
              </td>
              <td>
                {results
                  .filter((result) => result.label === method.label)
                  .map((result) => `${result.ms.toFixed(1)} ms`)
                  .join(' / ') || 'まだ測っていません'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="pane-label">追加された表（スクロールできます）</p>
      <div className="pane scroll-pane">
        <table>
          <tbody ref={tbodyRef} />
        </table>
      </div>
    </figure>
  );
}

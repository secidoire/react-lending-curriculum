import { useState } from 'react';

// 入力欄を1つだけ持つ、いちばん小さな例。
export function SearchField() {
  const [query, setQuery] = useState('');

  return (
    <div>
      <label>
        名前で検索{' '}
        <input value={query} onChange={(event) => setQuery(event.target.value)} />
      </label>
      <p>stateの中身：「{query}」（{query.length}文字）</p>
    </div>
  );
}

import type { Criteria } from './filterItems';

type Props = {
  criteria: Criteria;
  onChange: (next: Criteria) => void;
};

// 検索の条件を入力する欄。自分ではstateを持たない。
// いまの条件を props で受け取って表示し、変えられたら、新しい条件を onChange で親に知らせる。
export function SearchBox({ criteria, onChange }: Props) {
  return (
    <p>
      <label>
        名前で検索{' '}
        <input value={criteria.query} onChange={(event) => onChange({ ...criteria, query: event.target.value })} />
      </label>{' '}
      <label>
        <input
          type="checkbox"
          checked={criteria.category === 'book'}
          onChange={(event) => onChange({ ...criteria, category: event.target.checked ? 'book' : 'all' })}
        />{' '}
        本だけ
      </label>{' '}
      <label>
        <input
          type="checkbox"
          checked={criteria.sortByName}
          onChange={(event) => onChange({ ...criteria, sortByName: event.target.checked })}
        />{' '}
        名前順に並べる
      </label>
    </p>
  );
}

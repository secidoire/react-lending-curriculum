import { useContext, useSyncExternalStore } from 'react';
import { TermContext } from './TermContext';

export function TermList() {
  const store = useContext(TermContext);
  const terms = useSyncExternalStore(store.subscribe, store.getSnapshot);

  if (terms.length === 0) return null;

  return (
    <section className="term-list" aria-labelledby="term-list-heading">
      <h2 id="term-list-heading">この回の用語</h2>
      <ul>
        {terms.map((term) => (
          <li key={term}>{term}</li>
        ))}
      </ul>
    </section>
  );
}

import { useContext, useEffect } from 'react';
import { TermContext } from './TermContext';

type Props = { children: string };

export function Term({ children }: Props) {
  const store = useContext(TermContext);

  // Reactの外にある用語ストアと同期する。画面に出ている間だけ用語一覧に載せ、消えるときに取り下げる。
  useEffect(() => store.add(children), [store, children]);

  return <dfn className="term">{children}</dfn>;
}

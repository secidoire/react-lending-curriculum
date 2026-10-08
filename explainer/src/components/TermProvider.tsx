import { useState, type ReactNode } from 'react';
import { TermContext } from './TermContext';
import { createTermStore } from './termStore';

type Props = { children: ReactNode };

export function TermProvider({ children }: Props) {
  // ストアはページごとに1つ。初回のレンダーで1度だけ作る。
  const [store] = useState(createTermStore);
  return <TermContext value={store}>{children}</TermContext>;
}

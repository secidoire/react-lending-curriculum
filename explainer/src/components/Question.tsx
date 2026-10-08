import type { ReactNode } from 'react';

type Props = { children: ReactNode };

export function Question({ children }: Props) {
  return (
    <aside className="box question">
      <p className="box-label">考えてみよう</p>
      {children}
    </aside>
  );
}

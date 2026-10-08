import type { ReactNode } from 'react';
import { usePresentMode } from './PresentModeContext';
import { SessionNav } from './SessionNav';

type Props = { children: ReactNode };

export function Layout({ children }: Props) {
  const present = usePresentMode();

  return (
    <div className={present ? 'layout present' : 'layout'}>
      {!present && <SessionNav />}
      <main className="content">{children}</main>
    </div>
  );
}

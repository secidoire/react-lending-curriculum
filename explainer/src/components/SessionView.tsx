import { useEffect } from 'react';
import type { SessionPage } from '../router/pages';
import { mdxComponents } from './mdxComponents';
import { ModeSwitch } from './ModeSwitch';
import { TermList } from './TermList';
import { TermProvider } from './TermProvider';

type Props = { page: SessionPage };

export function SessionView({ page }: Props) {
  // ページを移ったら先頭から読めるようにする（Reactの外にあるスクロール位置との同期）。
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <TermProvider>
      <article>
        <ModeSwitch sessionId={page.id} />
        <h1>
          <span className="session-id">{page.id}</span> {page.title}
        </h1>
        <page.Content components={mdxComponents} />
        <TermList />
      </article>
    </TermProvider>
  );
}

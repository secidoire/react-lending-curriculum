import { formatHash } from '../router/parseHash';
import { pages } from '../router/pages';
import { usePresentMode } from './PresentModeContext';

type Props = { currentId: string | null };

// 回の一覧。左のナビゲーションと、ページ一覧の両方で使う。
export function SessionLinks({ currentId }: Props) {
  const present = usePresentMode();

  return (
    <ul className="session-links">
      {pages.map((page) => (
        <li key={page.id}>
          <a
            href={formatHash({ sessionId: page.id, present })}
            aria-current={page.id === currentId ? 'page' : undefined}
          >
            <span className="session-id">{page.id}</span> {page.title}
          </a>
        </li>
      ))}
    </ul>
  );
}

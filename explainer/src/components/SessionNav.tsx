import { useHashRoute } from '../router/useHashRoute';
import { SessionLinks } from './SessionLinks';

export function SessionNav() {
  const route = useHashRoute();

  return (
    <nav className="session-nav" aria-label="ページ一覧">
      <a className="site-title" href="#/">
        React原理 勉強会
      </a>
      <SessionLinks currentId={route.sessionId} />
    </nav>
  );
}

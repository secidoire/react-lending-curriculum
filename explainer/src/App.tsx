import { Layout } from './components/Layout';
import { PageIndex } from './components/PageIndex';
import { PresentModeContext } from './components/PresentModeContext';
import { SessionView } from './components/SessionView';
import { findPage } from './router/pages';
import { useHashRoute } from './router/useHashRoute';

export function App() {
  const route = useHashRoute();
  const page = route.sessionId === null ? undefined : findPage(route.sessionId);

  return (
    <PresentModeContext value={route.present}>
      <Layout>
        {page === undefined ? (
          <PageIndex notFound={route.sessionId !== null} />
        ) : (
          // keyを回のIDにして、ページを移ったら <Steps> の進み具合や用語一覧を作り直す。
          <SessionView key={page.id} page={page} />
        )}
      </Layout>
    </PresentModeContext>
  );
}

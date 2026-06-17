import { useEffect, useMemo, useState, type ReactElement } from 'react';
import type { PageKey } from './components';
import { AuraSealedPage, BirthAuraPage, MyAuraPage, RitualCheckInPage, ShareAuraPage } from './pages';

const pages: Record<PageKey, ReactElement> = {
  ritual: <RitualCheckInPage />,
  share: <ShareAuraPage />,
  sealed: <AuraSealedPage />,
  birth: <BirthAuraPage />,
  my: <MyAuraPage />
};

function getHashPage(): PageKey {
  const key = window.location.hash.replace('#', '') as PageKey;
  return key in pages ? key : 'ritual';
}

export function App() {
  const [page, setPage] = useState<PageKey>(() => getHashPage());

  useEffect(() => {
    const onHashChange = () => setPage(getHashPage());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const currentPage = useMemo(() => pages[page], [page]);

  return (
    <div className="app-root">
      {currentPage}
      <nav className="dev-screen-switcher" aria-label="Screen switcher">
        {(Object.keys(pages) as PageKey[]).map((key) => (
          <a key={key} className={key === page ? 'active' : ''} href={`#${key}`}>{key}</a>
        ))}
      </nav>
    </div>
  );
}

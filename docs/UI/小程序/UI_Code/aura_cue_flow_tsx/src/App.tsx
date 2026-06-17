import React, { useMemo } from 'react';
import { pages } from './pages';
import './styles.css';

export default function App() {
  const hash = window.location.hash.replace('#/', '') || 'draw';
  const page = useMemo(() => pages.find((item) => item.path === hash) ?? pages[0], [hash]);
  const Page = page.component;

  return (
    <>
      <Page />
      <nav className="route-switcher" aria-label="demo routes">
        {pages.map((item) => (
          <a key={item.path} className={item.path === page.path ? 'active' : ''} href={`#/${item.path}`}>
            {item.title}
          </a>
        ))}
      </nav>
    </>
  );
}

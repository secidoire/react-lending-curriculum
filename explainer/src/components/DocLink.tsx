import type { ReactNode } from 'react';

type Props = {
  href: string;
  children: ReactNode;
};

export function DocLink({ href, children }: Props) {
  return (
    <a className="doc-link" href={href} target="_blank" rel="noreferrer">
      {children}
      <span aria-hidden="true"> ↗</span>
      <span className="visually-hidden">（外部サイト）</span>
    </a>
  );
}

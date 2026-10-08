import type { ReactNode } from 'react';

type Props = {
  label?: string;
  children: ReactNode;
};

export function Preview({ label = '実行結果', children }: Props) {
  return (
    <figure className="box preview">
      <figcaption className="box-label">{label}</figcaption>
      {children}
    </figure>
  );
}

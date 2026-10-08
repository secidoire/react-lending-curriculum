import type { ReactNode } from 'react';

type Props = {
  label?: string;
  children: ReactNode;
};

// 答えは、読者が自分の答えを出してから開く。開閉はブラウザの <details> に任せ、stateを持たない。
export function Reveal({ label = '答えを見る', children }: Props) {
  return (
    <details className="reveal">
      <summary>{label}</summary>
      <div className="reveal-body">{children}</div>
    </details>
  );
}

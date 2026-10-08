import type { ReactNode } from 'react';

type Props = {
  wrong: string;
  children: ReactNode;
};

export function Misconception({ wrong, children }: Props) {
  return (
    <aside className="box misconception">
      <p className="box-label">よくある誤解</p>
      <p className="misconception-wrong">
        <span className="misconception-mark">誤解：</span>
        {wrong}
      </p>
      <div className="misconception-right">
        <span className="misconception-mark">正しくは：</span>
        {children}
      </div>
    </aside>
  );
}

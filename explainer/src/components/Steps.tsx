import { Children, useEffect, useRef, useState, type ReactNode } from 'react';
import { usePresentMode } from './PresentModeContext';
import { isStep, isTypingTarget, nextVisibleCount } from './steps';

type Props = { children: ReactNode };

export function Steps({ children }: Props) {
  const present = usePresentMode();
  const steps = Children.toArray(children).filter(isStep);
  const total = steps.length;
  const [visibleCount, setVisibleCount] = useState(1);
  const rootRef = useRef<HTMLDivElement>(null);

  // 読むモードでは最初からすべて見せる。表示する数はstateにせず、モードから毎回計算する。
  const shownCount = present ? visibleCount : total;
  const pending = shownCount < total;

  // →キーでも進められるようにする（Reactの外にあるキーボード入力の購読）。
  useEffect(() => {
    if (!pending) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== 'ArrowRight' || isTypingTarget(event.target)) return;
      // 1ページに <Steps> が複数あるときは、いちばん上の「まだ続きがあるもの」だけを進める。
      if (document.querySelector('[data-steps-pending]') !== rootRef.current) return;
      setVisibleCount((count) => nextVisibleCount(count, total));
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [pending, total]);

  return (
    <div ref={rootRef} className="steps" data-steps-pending={pending ? '' : undefined}>
      {steps.slice(0, shownCount)}
      {pending && (
        <button
          type="button"
          className="steps-next"
          onClick={() => setVisibleCount((count) => nextVisibleCount(count, total))}
        >
          次へ（{shownCount} / {total}）
        </button>
      )}
    </div>
  );
}

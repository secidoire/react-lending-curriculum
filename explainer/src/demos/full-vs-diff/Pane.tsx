import { useEffect, useRef, useState } from 'react';
import { createDom, render } from '../../shared-mini-react/miniReact';
import { addCounts, countMutations, emptyCounts, formatCounts, formatFocus, type DemoState } from './logic';
import { loanListView } from './view';

type Props = {
  title: string;
  /** full：毎回すべて作り直す ／ diff：前回と比べて違うところだけ直す */
  mode: 'full' | 'diff';
  state: DemoState;
};

// 変更されたところを0.6秒だけ枠で示す。DOMは書き換えない（書き換えると、それも変更として数えてしまう）。
function flash(node: Node) {
  const element = node instanceof Element ? node : node.parentElement;
  element?.animate([{ outline: '3px solid #bf8700', background: '#fff8c5' }, { outline: '3px solid transparent' }], 600);
}

export function Pane({ title, mode, state }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<MutationObserver | null>(null);
  const [counts, setCounts] = useState(emptyCounts);
  const [focusLabel, setFocusLabel] = useState<string | null>(null);

  // Reactの外のシステム（ミニReactが描くDOM）を見張る。変更を数え、フォーカスの場所を読む。
  useEffect(() => {
    const container = containerRef.current;
    if (container === null) return;

    function readFocus() {
      const active = document.activeElement;
      setFocusLabel(active !== null && container?.contains(active) ? active.getAttribute('aria-label') : null);
    }
    const observer = new MutationObserver((records) => {
      setCounts((current) => addCounts(current, countMutations(records)));
      for (const record of records) {
        if (record.type === 'childList') record.addedNodes.forEach(flash);
        else flash(record.target);
      }
      readFocus();
    });
    observer.observe(container, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      // 数えるのは、この一覧が実際に使っている属性だけ。ブラウザの拡張機能などが入力欄に付ける属性は数えない。
      attributeFilter: ['aria-label', 'size', 'placeholder'],
    });
    observerRef.current = observer;
    container.addEventListener('focusin', readFocus);
    container.addEventListener('focusout', readFocus);

    return () => {
      observer.disconnect();
      container.removeEventListener('focusin', readFocus);
      container.removeEventListener('focusout', readFocus);
      container.replaceChildren();
    };
  }, []);

  // 状態が変わるたびに、ミニReactで描き直す。
  useEffect(() => {
    const container = containerRef.current;
    if (container === null) return;

    const isFirstDraw = container.firstChild === null;
    const vnode = loanListView(state);
    if (mode === 'full') container.replaceChildren(createDom(vnode));
    else render(vnode, container);

    // 最初の表示のぶんは数えない。見せたいのは、操作のあとの変更だけ。
    if (isFirstDraw) observerRef.current?.takeRecords();
  }, [mode, state]);

  return (
    <section className="demo-pane" aria-label={title}>
      <h3>{title}</h3>
      <div ref={containerRef} />
      <p className="demo-status">DOMの変更：{formatCounts(counts)}</p>
      <p className="demo-status">{formatFocus(focusLabel)}</p>
    </section>
  );
}

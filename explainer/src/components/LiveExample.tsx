import { useEffect, useRef, useState } from 'react';

type Props = {
  label?: string;
  /** 渡された要素の中に例を組み立てる関数。Reactを使わない、素のJavaScriptで書かれている */
  start: (root: HTMLElement) => void;
};

// Reactを使わずに書いた小さな例を、ページの中で動かす枠。
export function LiveExample({ label = '動かしてみよう', start }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [runCount, setRunCount] = useState(0);

  // Reactの外のシステム（素のJavaScriptで組み立てたDOM）と同期する。
  // 「最初からやり直す」で runCount が変わると、いったん中身を空にして組み立て直す。
  useEffect(() => {
    const root = rootRef.current;
    if (root === null) return;

    start(root);
    return () => root.replaceChildren();
  }, [start, runCount]);

  return (
    <figure className="box live-example">
      <figcaption className="box-label">
        {label}
        <button type="button" className="live-example-reset" onClick={() => setRunCount(runCount + 1)}>
          最初からやり直す
        </button>
      </figcaption>
      <div ref={rootRef} className="live-example-body" />
    </figure>
  );
}

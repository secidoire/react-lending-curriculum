import { useEffect, useRef, useState } from 'react';
import { startSandbox } from './runSandbox';
import type { SandboxFile, SandboxSpec } from './types';

type Props = {
  /** 読者が書き換えた、いまのファイル */
  files: readonly SandboxFile[];
  spec: SandboxSpec;
};

// 入力が止まってから実行するまでの待ち時間。1文字打つたびに実行しないようにする。
const RUN_DELAY_MS = 400;

export function SandboxPreview({ files, spec }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  // Reactの外のシステム（読者が書き換えたコードが組み立てるDOM）と同期する。
  // コードが変わるたびに、少し待ってから実行し直す。待っている間に次の変更が来たら、前の予約は取り消す。
  useEffect(() => {
    const root = rootRef.current;
    if (root === null) return;

    const timer = setTimeout(() => {
      try {
        startSandbox(spec, files, root);
        setError(null);
      } catch (caught) {
        root.replaceChildren();
        setError(caught instanceof Error ? caught.message : String(caught));
      }
    }, RUN_DELAY_MS);
    return () => clearTimeout(timer);
  }, [files, spec]);

  return (
    <div className="sandbox-preview">
      <p className="sandbox-pane-label">実行結果</p>
      <div ref={rootRef} className="sandbox-root" />
      {error !== null && (
        <p className="sandbox-error" role="alert">
          <strong>エラー：</strong>
          {error}
        </p>
      )}
    </div>
  );
}

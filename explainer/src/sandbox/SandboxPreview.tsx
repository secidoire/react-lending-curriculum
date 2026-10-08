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
// コンソール欄に残す行数。これより古い行は捨てる。
const MAX_LOG_LINES = 30;

function messageOf(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export function SandboxPreview({ files, spec }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [logLines, setLogLines] = useState<readonly string[]>([]);

  // Reactの外のシステム（読者が書き換えたコードが組み立てるDOM）と同期する。
  // コードが変わるたびに、少し待ってから実行し直す。待っている間に次の変更が来たら、前の予約は取り消す。
  useEffect(() => {
    const root = rootRef.current;
    if (root === null) return;

    let cleanup = () => {};
    let stopped = false;
    const timer = setTimeout(() => {
      setLogLines([]);
      try {
        cleanup = startSandbox(spec, files, root, {
          onError: (caught) => setError(messageOf(caught)),
          // 例の console.log は、例のコンポーネントのレンダー中に呼ばれることがある。
          // その最中にこちらのstateを変えないよう、区切りがついてから足す。
          onLog: (line) =>
            queueMicrotask(() => {
              if (!stopped) setLogLines((lines) => [...lines, line].slice(-MAX_LOG_LINES));
            }),
        });
        setError(null);
      } catch (caught) {
        root.replaceChildren();
        setError(messageOf(caught));
      }
    }, RUN_DELAY_MS);

    // 例が動かしたままのもの（タイマーなど）を止めてから、次の実行に移る。
    return () => {
      stopped = true;
      clearTimeout(timer);
      cleanup();
    };
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
      {logLines.length > 0 && (
        <section className="sandbox-console" aria-label="コンソール">
          <p className="sandbox-pane-label">
            コンソール（console.log の出力）{' '}
            <button type="button" onClick={() => setLogLines([])}>
              消す
            </button>
          </p>
          <ol>
            {logLines.map((line, index) => (
              // 行は後ろに足すだけで並べ替えないので、位置をkeyにする。
              <li key={index}>{line}</li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}

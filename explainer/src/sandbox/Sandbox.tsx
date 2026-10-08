import { useState } from 'react';
import { changedLineNumbers } from './changedLines';
import { CodeEditor } from './CodeEditor';
import { SandboxPreview } from './SandboxPreview';
import type { SandboxFile, SandboxSpec } from './types';

type Props = {
  spec: SandboxSpec;
  /** true にすると、コードを閉じた状態で出す。先に操作だけで気づかせたい例に使う */
  codeClosed?: boolean;
};

// コードと実行結果を並べて見せる枠。コードを書き換えると、実行結果が変わる。
export function Sandbox({ spec, codeClosed = false }: Props) {
  const [files, setFiles] = useState<readonly SandboxFile[]>(spec.files);
  const [activeName, setActiveName] = useState(spec.files[0]?.name ?? '');
  const [codeOpen, setCodeOpen] = useState(!codeClosed);
  // 「最初に戻す」のたびに増やす。エディタと実行結果の key に使い、両方を作り直す。
  const [resetCount, setResetCount] = useState(0);

  const activeFile = files.find((file) => file.name === activeName);

  function changeActiveFile(code: string) {
    setFiles(files.map((file) => (file.name === activeName ? { ...file, code } : file)));
  }

  function reset() {
    setFiles(spec.files);
    setResetCount(resetCount + 1);
  }

  return (
    <figure className={codeOpen ? 'sandbox' : 'sandbox code-closed'}>
      <figcaption className="sandbox-bar">
        {codeOpen && (
          <span className="sandbox-tabs" role="tablist" aria-label="ファイル">
            {files.map((file) => (
              <button
                key={file.name}
                type="button"
                role="tab"
                aria-selected={file.name === activeName}
                onClick={() => setActiveName(file.name)}
              >
                {file.name}
                {file.changedFrom !== undefined && '（変更あり）'}
              </button>
            ))}
          </span>
        )}
        <span className="sandbox-actions">
          <button type="button" onClick={() => setCodeOpen(!codeOpen)}>
            {codeOpen ? 'コードを隠す' : 'コードを見る'}
          </button>
          <button type="button" onClick={reset}>
            最初に戻す
          </button>
        </span>
      </figcaption>

      {codeOpen && activeFile?.changedFrom !== undefined && (
        <p className="sandbox-legend">
          <span className="sandbox-legend-mark" aria-hidden="true" /> 左に線のある色付きの行は、前の段階の {activeFile.name}{' '}
          から変わった行です。
        </p>
      )}

      <div className="sandbox-panes">
        {codeOpen && activeFile !== undefined && (
          <CodeEditor
            // ファイルを切り替えたときと、最初に戻したときは、エディタを作り直して中身を入れ替える。
            key={`${activeFile.name}:${resetCount}`}
            initialCode={activeFile.code}
            label={`${activeFile.name} のコード`}
            changedLines={
              activeFile.changedFrom === undefined ? [] : changedLineNumbers(activeFile.code, activeFile.changedFrom)
            }
            onChange={changeActiveFile}
          />
        )}
        <SandboxPreview key={resetCount} files={files} spec={spec} />
      </div>
    </figure>
  );
}

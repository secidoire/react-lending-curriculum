import { javascript } from '@codemirror/lang-javascript';
import { StateField, type Extension } from '@codemirror/state';
import { Decoration, type DecorationSet } from '@codemirror/view';
import { basicSetup, EditorView } from 'codemirror';
import { useEffect, useRef } from 'react';

const changedLineMark = Decoration.line({ class: 'cm-changed-line' });

// 指定した行に印を付ける。読者がコードを書き換えて行がずれても、印は同じ行についていく。
function markLines(lineNumbers: readonly number[]): Extension {
  return StateField.define<DecorationSet>({
    create(state) {
      const existing = lineNumbers.filter((lineNumber) => lineNumber <= state.doc.lines);
      return Decoration.set(existing.map((lineNumber) => changedLineMark.range(state.doc.line(lineNumber).from)));
    },
    update(marks, transaction) {
      return marks.map(transaction.changes);
    },
    provide: (field) => EditorView.decorations.from(field),
  });
}

type Props = {
  /** 最初に入れておくコード。途中で変えても反映しない（別のコードに替えるときは、key を変えて作り直す） */
  initialCode: string;
  label: string;
  /** 印を付ける行の番号（1始まり・昇順）。最初に作るときにだけ使う */
  changedLines?: readonly number[];
  onChange: (code: string) => void;
};

export function CodeEditor({ initialCode, label, changedLines = [], onChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  // エディタは最初に1回だけ作りたい。作ったあとに props が変わっても作り直さないよう、最新の値を ref に置いておく。
  const latest = useRef({ initialCode, label, changedLines, onChange });
  useEffect(() => {
    latest.current = { initialCode, label, changedLines, onChange };
  });

  // Reactの外のシステム（CodeMirrorのエディタ）と同期する。表示されたときに作り、消えるときに片づける。
  useEffect(() => {
    const container = containerRef.current;
    if (container === null) return;

    const view = new EditorView({
      doc: latest.current.initialCode,
      parent: container,
      extensions: [
        basicSetup,
        javascript({ typescript: true, jsx: true }),
        markLines(latest.current.changedLines),
        EditorView.contentAttributes.of({ 'aria-label': latest.current.label }),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) latest.current.onChange(update.state.doc.toString());
        }),
      ],
    });
    return () => view.destroy();
  }, []);

  return <div ref={containerRef} className="code-editor" />;
}

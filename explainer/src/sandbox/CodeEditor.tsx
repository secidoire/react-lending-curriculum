import { javascript } from '@codemirror/lang-javascript';
import { basicSetup, EditorView } from 'codemirror';
import { useEffect, useRef } from 'react';

type Props = {
  /** 最初に入れておくコード。途中で変えても反映しない（別のコードに替えるときは、key を変えて作り直す） */
  initialCode: string;
  label: string;
  onChange: (code: string) => void;
};

export function CodeEditor({ initialCode, label, onChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  // エディタは最初に1回だけ作りたい。作ったあとに props が変わっても作り直さないよう、最新の値を ref に置いておく。
  const latest = useRef({ initialCode, label, onChange });
  useEffect(() => {
    latest.current = { initialCode, label, onChange };
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

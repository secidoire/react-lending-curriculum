import { useState } from 'react';
import { isMisaligned } from './logic';

type Props = {
  name: string;
  keyDescription: string;
};

// 一覧の1行。備品名と「借りる理由」の入力欄を持つ。
export function ReasonRow({ name, keyDescription }: Props) {
  // この行が最初に作られたときの備品名。stateは、行が作り直されない限り最初の値のまま残る。
  const [nameWhenCreated] = useState(name);

  return (
    <li className="key-row">
      <span className="key-row-name">{name}</span>
      {/* defaultValue は、入力欄が作られたときに1回だけ使われる。そのあとの中身はDOMが持つ。 */}
      <input defaultValue={`${name}を借りる理由`} aria-label={`${name}を借りる理由`} size={22} />
      <span className="key-row-key">{keyDescription}</span>
      {isMisaligned(nameWhenCreated, name) && (
        <strong className="key-row-misaligned">ずれ（もとは「{nameWhenCreated}」の行）</strong>
      )}
    </li>
  );
}

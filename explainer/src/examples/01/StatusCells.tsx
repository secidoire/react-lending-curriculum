type Props = { lentTo: string | null };

// 「状態」と「借りている人」の2つのセル。
export function StatusCells({ lentTo }: Props) {
  return (
    <>
      <td>{lentTo !== null ? '貸出中' : '貸出できます'}</td>
      <td>{lentTo !== null ? `${lentTo}さん` : '—'}</td>
    </>
  );
}

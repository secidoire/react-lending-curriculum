import { describeKey, type Item, type KeyMode } from './logic';
import { ReasonRow } from './ReasonRow';

type Props = {
  title: string;
  mode: KeyMode;
  items: readonly Item[];
};

// 同じ一覧を、keyの付け方だけ変えて描く。違いは、下の3つの map の中の key の書き方だけ。
export function KeyColumn({ title, mode, items }: Props) {
  return (
    <section className="key-column" aria-label={title}>
      <h3>{title}</h3>
      <ul>
        {mode === 'none' &&
          // 教材のために、わざと key を書いていない。Reactはコンソールに警告を出し、位置で対応づける。
          items.map((item, index) => <ReasonRow name={item.name} keyDescription={describeKey(mode, item, index)} />)}
        {mode === 'index' &&
          items.map((item, index) => (
            <ReasonRow key={index} name={item.name} keyDescription={describeKey(mode, item, index)} />
          ))}
        {mode === 'id' &&
          items.map((item, index) => (
            <ReasonRow key={item.id} name={item.name} keyDescription={describeKey(mode, item, index)} />
          ))}
      </ul>
    </section>
  );
}

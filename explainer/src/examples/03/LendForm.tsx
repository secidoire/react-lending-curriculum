import { useId, useRef, useState } from 'react';
import { FormField } from './FormField';
import type { Item } from './items';
import { FIELD_NAMES, parseLendForm, type FieldErrors, type FieldName, type LendRequest } from './lendFormSchema';

type Props = {
  items: readonly Item[];
  onLend: (request: LendRequest) => void;
};

// 入力欄の値は、すべて文字列。正しいかどうかは、まだわからない。
const emptyValues: Record<FieldName, string> = { itemId: '', userName: '', from: '', to: '' };

export function LendForm({ items, onLend }: Props) {
  const id = useId();
  const [values, setValues] = useState(emptyValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const itemRef = useRef<HTMLSelectElement>(null);
  const userRef = useRef<HTMLInputElement>(null);
  const fromRef = useRef<HTMLInputElement>(null);
  const toRef = useRef<HTMLInputElement>(null);

  function change(name: FieldName, value: string) {
    setValues({ ...values, [name]: value });
  }

  function submit(event: { preventDefault: () => void }) {
    event.preventDefault();

    // 文字列の集まりを、確かめてから LendRequest に変える。
    const result = parseLendForm(values);
    if (!result.ok) {
      setErrors(result.errors);
      // 最初に問題のあった欄へ、フォーカスを移す。
      const refs = { itemId: itemRef, userName: userRef, from: fromRef, to: toRef };
      const firstInvalid = FIELD_NAMES.find((name) => result.errors[name] !== undefined);
      if (firstInvalid !== undefined) refs[firstInvalid].current?.focus();
      return;
    }

    onLend(result.request);
    setValues(emptyValues);
    setErrors({});
  }

  return (
    <form className="lend-form" onSubmit={submit} noValidate>
      <FormField label="備品" inputId={`${id}-itemId`} error={errors.itemId}>
        <select ref={itemRef} id={`${id}-itemId`} value={values.itemId} onChange={(event) => change('itemId', event.target.value)}>
          <option value="">（選んでください）</option>
          {items.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </FormField>
      <FormField label="借りる人" inputId={`${id}-userName`} error={errors.userName}>
        <input ref={userRef} id={`${id}-userName`} value={values.userName} onChange={(event) => change('userName', event.target.value)} />
      </FormField>
      <FormField label="いつから" inputId={`${id}-from`} error={errors.from}>
        <input ref={fromRef} id={`${id}-from`} type="date" value={values.from} onChange={(event) => change('from', event.target.value)} />
      </FormField>
      <FormField label="いつまで" inputId={`${id}-to`} error={errors.to}>
        <input ref={toRef} id={`${id}-to`} type="date" value={values.to} onChange={(event) => change('to', event.target.value)} />
      </FormField>
      <button type="submit">貸出を登録</button>
    </form>
  );
}

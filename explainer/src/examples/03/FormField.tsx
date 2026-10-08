import type { ReactNode } from 'react';

type Props = {
  label: string;
  /** 中に置く入力欄の id。ラベルと入力欄を結びつける */
  inputId: string;
  error: string | undefined;
  /** 入力欄そのもの。タグの中身として渡されたものが、children という props で届く */
  children: ReactNode;
};

// ラベル・入力欄・エラーの文を、ひとまとまりにする。
export function FormField({ label, inputId, error, children }: Props) {
  return (
    <div className="form-field">
      <label htmlFor={inputId}>{label}</label>
      {children}
      {error !== undefined && (
        <p id={`${inputId}-error`} className="field-error">
          {error}
        </p>
      )}
    </div>
  );
}

import { z } from 'zod';

// フォームから来た値が「貸出の依頼」として正しい形かを確かめるスキーマ。
// 入力欄の値は、すべて文字列で届く。
export const LendFormSchema = z
  .object({
    itemId: z.string().min(1, '備品を選んでください'),
    userName: z.string().trim().min(1, '借りる人を入力してください'),
    from: z.iso.date('「いつから」の日付を入力してください'),
    to: z.iso.date('「いつまで」の日付を入力してください'),
  })
  .refine((value) => value.from <= value.to, {
    path: ['to'],
    message: '「いつまで」は、「いつから」と同じ日か、それより後にしてください',
  });

// 確かめ終わった値の型。
export type LendRequest = z.infer<typeof LendFormSchema>;

export const FIELD_NAMES = ['itemId', 'userName', 'from', 'to'] as const;
export type FieldName = (typeof FIELD_NAMES)[number];
export type FieldErrors = Partial<Record<FieldName, string>>;

export type ParseResult = { ok: true; request: LendRequest } | { ok: false; errors: FieldErrors };

// 何が来るかわからない値（unknown）を受け取り、正しければ LendRequest に、
// 正しくなければ「どの欄が、なぜだめか」に変える。
export function parseLendForm(input: unknown): ParseResult {
  const result = LendFormSchema.safeParse(input);
  if (result.success) return { ok: true, request: result.data };

  const errors: FieldErrors = {};
  for (const issue of result.error.issues) {
    const name = FIELD_NAMES.find((fieldName) => fieldName === issue.path[0]);
    // 1つの欄に問題がいくつもあるときは、最初の1つだけを伝える。
    if (name !== undefined && errors[name] === undefined) errors[name] = issue.message;
  }
  return { ok: false, errors };
}

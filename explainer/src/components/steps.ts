import type { ReactNode } from 'react';

// MDXは <Steps> の子の間に改行だけの文字列を挟む。それを1ステップと数えないようにする。
export function isStep(child: ReactNode): boolean {
  return !(typeof child === 'string' && child.trim() === '');
}

export function nextVisibleCount(current: number, total: number): number {
  return Math.min(current + 1, total);
}

// 入力欄で→キーを押したときは、カーソル移動を優先する。
export function isTypingTarget(target: EventTarget | null): boolean {
  return target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement;
}

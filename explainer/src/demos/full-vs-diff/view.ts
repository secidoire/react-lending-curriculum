import { h, type VNode } from '../../shared-mini-react/miniReact';
import type { DemoState } from './logic';

// いまの状態から、貸出一覧を表すオブジェクトを作る。左右のペインで同じものを使う。
export function loanListView(state: DemoState): VNode {
  return h(
    'table',
    null,
    h(
      'tbody',
      null,
      state.loans.map((loan, index) =>
        h(
          'tr',
          { key: loan.id },
          h('td', null, loan.itemName),
          h('td', null, loan.status === 'lent' ? '貸出中' : '返却済'),
          h('td', null, h('input', { size: 12, placeholder: 'メモ', 'aria-label': `メモ欄${index + 1}` })),
        ),
      ),
    ),
  );
}

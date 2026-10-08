import type { RehypeShikiOptions } from '@shikijs/rehype';
import { parseLineRanges } from './parseLineRanges.ts';

type ShikiTransformer = NonNullable<RehypeShikiOptions['transformers']>[number];

// ```js {2-3} のように指定された行に class="highlighted" を付ける。
// 見た目は styles/global.css の .highlighted で決める（背景色に加えて左の線でも示す）。
export const lineHighlightTransformer: ShikiTransformer = {
  name: 'line-highlight',
  line(node, line) {
    const highlighted = parseLineRanges(this.options.meta?.__raw ?? '');
    if (highlighted.includes(line)) this.addClassToHast(node, 'highlighted');
  },
};

import { DocLink } from './DocLink';
import { LiveExample } from './LiveExample';
import { Misconception } from './Misconception';
import { Preview } from './Preview';
import { Question } from './Question';
import { Reveal } from './Reveal';
import { Steps } from './Steps';
import { Term } from './Term';

// 各回のMDXから、importを書かずに使えるコンポーネント。
export const mdxComponents = { DocLink, LiveExample, Misconception, Preview, Question, Reveal, Steps, Term };

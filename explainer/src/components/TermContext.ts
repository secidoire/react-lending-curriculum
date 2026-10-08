import { createContext } from 'react';
import { createTermStore, type TermStore } from './termStore';

// 用語を集めるストアを、ページ内の <Term> と <TermList> に配る。
export const TermContext = createContext<TermStore>(createTermStore());

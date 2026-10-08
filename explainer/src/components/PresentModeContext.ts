import { createContext, useContext } from 'react';

// 発表モードかどうか。ページを開いている間ほぼ変わらず、あちこちのコンポーネントが読む値なので、
// propsで順に渡さずContextで配る。
export const PresentModeContext = createContext(false);

export function usePresentMode(): boolean {
  return useContext(PresentModeContext);
}

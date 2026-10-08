import type { MDXContent } from 'mdx/types';
import { z } from 'zod';
import { compareSessionIds, sessionIdFromPath } from './sessionOrder';

export type SessionPage = {
  id: string;
  title: string;
  Content: MDXContent;
};

// 各回のMDXは、本文（default）と `export const title` を持つ。
// title の書き忘れを、画面が崩れる前にここで見つける。
const SessionModuleSchema = z.object({
  default: z.custom<MDXContent>((value) => typeof value === 'function'),
  title: z.string().min(1),
});

const modules = import.meta.glob('../sessions/*.mdx', { eager: true });

export const pages: SessionPage[] = Object.entries(modules)
  .map(([path, module]) => {
    const parsed = SessionModuleSchema.safeParse(module);
    if (!parsed.success) {
      throw new Error(`${path} に export const title がありません`);
    }
    return { id: sessionIdFromPath(path), title: parsed.data.title, Content: parsed.data.default };
  })
  .sort((a, b) => compareSessionIds(a.id, b.id));

export function findPage(sessionId: string): SessionPage | undefined {
  return pages.find((page) => page.id === sessionId);
}

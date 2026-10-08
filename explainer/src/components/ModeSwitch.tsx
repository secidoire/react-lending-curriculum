import { formatHash } from '../router/parseHash';
import { usePresentMode } from './PresentModeContext';

type Props = { sessionId: string };

export function ModeSwitch({ sessionId }: Props) {
  const present = usePresentMode();

  return (
    <p className="mode-switch">
      <a href={formatHash({ sessionId, present: !present })}>
        {present ? '読むモードに戻る' : '発表モードで開く'}
      </a>
    </p>
  );
}

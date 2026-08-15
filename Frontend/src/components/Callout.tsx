import { ReactNode } from 'react';
import { AlertTriangle, Info } from 'lucide-react';

export interface CalloutProps {
  type?: 'info' | 'warning';
  children: ReactNode;
}

export default function Callout({ type = 'info', children }: CalloutProps) {
  return (
    <div className="border border-border rounded-md p-4 my-4 bg-surface flex gap-3">
      <div className="flex-shrink-0 mt-0.5">
        {type === 'warning' ? (
          <AlertTriangle className="w-4 h-4 text-text-muted" />
        ) : (
          <Info className="w-4 h-4 text-text-muted" />
        )}
      </div>
      <div className="text-sm text-text-secondary leading-relaxed">{children}</div>
    </div>
  );
}

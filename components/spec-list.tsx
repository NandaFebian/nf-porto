import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface SpecItem {
  label: string;
  value: ReactNode;
}

/** Facts laid out like frontmatter: a lowercase mono key beside its value. */
export function SpecList({ items, className }: { items: SpecItem[]; className?: string }) {
  return (
    <dl className={cn('grid grid-cols-[max-content_1fr] gap-x-5 gap-y-1.5 text-sm', className)}>
      {items.map((item) => (
        <div key={item.label} className="contents">
          <dt className="font-mono text-xs leading-5 text-fd-muted-foreground">{item.label}</dt>
          <dd className="min-w-0 leading-5">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

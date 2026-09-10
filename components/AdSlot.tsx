import { cn } from '@/lib/utils/cn';

export type AdPosition = 'header' | 'in-article' | 'sidebar' | 'below-content' | 'in-feed';

interface AdSlotProps {
  position: AdPosition;
  className?: string;
}

/**
 * Reserved AdSense inventory. Renders a styled, fixed-height placeholder so
 * inserting the real ad unit later causes zero cumulative layout shift.
 * Replace the inner div with the <ins class="adsbygoogle"> snippet after approval.
 */
const dimensions: Record<AdPosition, { classes: string; label: string }> = {
  header: { classes: 'h-24 md:h-[90px]', label: 'Leaderboard · 728×90' },
  'in-article': { classes: 'h-[250px]', label: 'In-article · 336×280' },
  sidebar: { classes: 'h-[600px]', label: 'Sidebar · 300×600' },
  'below-content': { classes: 'h-[280px]', label: 'Below content · 336×280' },
  'in-feed': { classes: 'h-[250px]', label: 'In-feed · responsive' },
};

export function AdSlot({ position, className }: AdSlotProps) {
  const { classes, label } = dimensions[position];

  return (
    <aside aria-label="Advertisement" data-ad-position={position} className={cn('w-full', className)}>
      <div
        className={cn(
          'flex w-full items-center justify-center rounded-xl border border-dashed border-border bg-muted/60',
          classes
        )}
      >
        <div className="text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Advertisement</p>
          <p className="mt-1 text-xs text-muted-foreground/70">{label}</p>
        </div>
      </div>
    </aside>
  );
}

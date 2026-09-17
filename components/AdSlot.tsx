'use client';

import { useEffect, useRef } from 'react';
import { adsenseClient, adsenseSlots, isAdSlotConfigured, type AdPosition } from '@/lib/adsense';
import { cn } from '@/lib/utils/cn';

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

interface AdSlotProps {
  position: AdPosition;
  className?: string;
}

export function AdSlot({ position, className }: AdSlotProps) {
  const initialized = useRef(false);
  const slot = adsenseSlots[position];
  const configured = isAdSlotConfigured(position);

  useEffect(() => {
    if (!configured || initialized.current) return;
    initialized.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error('AdSense unit initialization failed', error);
    }
  }, [configured]);

  if (!configured) return null;

  return (
    <aside aria-label="Advertisement" data-ad-position={position} className={cn('w-full', className)}>
      <ins
        className="adsbygoogle block"
        style={{ display: 'block' }}
        data-ad-client={adsenseClient}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}

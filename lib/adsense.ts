export type AdPosition = 'header' | 'in-article' | 'sidebar' | 'below-content' | 'in-feed';

export const adsenseEnabled = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === 'true';
export const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim() || '';

export const adsenseSlots: Record<AdPosition, string> = {
  header: process.env.NEXT_PUBLIC_ADSENSE_HOME_HEADER_SLOT?.trim() || '',
  'in-article': process.env.NEXT_PUBLIC_ADSENSE_IN_ARTICLE_SLOT?.trim() || '',
  sidebar: process.env.NEXT_PUBLIC_ADSENSE_SIDEBAR_SLOT?.trim() || '',
  'below-content': process.env.NEXT_PUBLIC_ADSENSE_BELOW_CONTENT_SLOT?.trim() || '',
  'in-feed': process.env.NEXT_PUBLIC_ADSENSE_IN_FEED_SLOT?.trim() || '',
};

export const isAdSlotConfigured = (position: AdPosition) => adsenseEnabled && Boolean(adsenseClient) && Boolean(adsenseSlots[position]);
export const adsenseScriptEnabled = adsenseEnabled && Boolean(adsenseClient) && Object.values(adsenseSlots).some(Boolean);

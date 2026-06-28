type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

const affiliateClickEvent = 'affiliate_click';
const scriptEl = document.currentScript as HTMLScriptElement | null;
const ga4MeasurementId = scriptEl?.dataset.ga4MeasurementId?.trim() || '';
const analyticsWindow = window as AnalyticsWindow;

function installGtag(measurementId: string): void {
  analyticsWindow.dataLayer = analyticsWindow.dataLayer || [];
  analyticsWindow.gtag =
    analyticsWindow.gtag ||
    function gtagProxy(...args: unknown[]) {
      analyticsWindow.dataLayer?.push(args);
    };

  analyticsWindow.gtag('js', new Date());
  analyticsWindow.gtag('config', measurementId);
}

function affiliateLinkFrom(target: EventTarget | null): HTMLAnchorElement | null {
  if (!(target instanceof Element)) return null;
  return target.closest<HTMLAnchorElement>(`a[data-analytics-event="${affiliateClickEvent}"]`);
}

function trackAffiliateClick(link: HTMLAnchorElement): void {
  if (typeof analyticsWindow.gtag !== 'function') return;

  analyticsWindow.gtag('event', affiliateClickEvent, {
    affiliate_partner: link.dataset.affiliatePartner || 'unknown',
    affiliate_slot: link.dataset.affiliateSlot || 'unknown',
    link_url: link.href,
  });
}

if (ga4MeasurementId) {
  installGtag(ga4MeasurementId);
}

document.addEventListener('click', event => {
  const link = affiliateLinkFrom(event.target);
  if (!link) return;

  trackAffiliateClick(link);
});

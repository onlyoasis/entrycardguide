type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

const affiliateClickEvent = 'affiliate_click';
const scriptEl = document.currentScript as HTMLScriptElement | null;
const ga4MeasurementId = scriptEl?.dataset.ga4MeasurementId?.trim() || '';
const analyticsWindow = window as AnalyticsWindow;
const ga4Hostname = scriptEl?.dataset.ga4Hostname?.trim() || '';
const enabled = Boolean(ga4MeasurementId && ga4Hostname && window.location.hostname === ga4Hostname);

function installGtag(measurementId: string): void {
  analyticsWindow.dataLayer = analyticsWindow.dataLayer || [];
  analyticsWindow.gtag =
    analyticsWindow.gtag ||
    function gtagProxy() {
      analyticsWindow.dataLayer?.push(arguments);
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

if (enabled) {
  installGtag(ga4MeasurementId);
}

document.addEventListener('click', event => {
  if (!enabled || !(event.target instanceof Element)) return;
  const official = event.target.closest<HTMLAnchorElement>('a[data-analytics-event="official_link_click"]');
  if (official) {
    // Only template-authored identifiers: never send form values or query strings.
    analyticsWindow.gtag?.('event', 'official_link_click', {
      destination: official.dataset.country,
      official_key: official.dataset.officialKey,
      link_slot: official.dataset.linkSlot,
    });
    return;
  }
  const link = affiliateLinkFrom(event.target);
  if (link) trackAffiliateClick(link);
});

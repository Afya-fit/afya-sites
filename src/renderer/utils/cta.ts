export function buildCtaHref(baseHref: string, utm?: Record<string, string | undefined>): string {
  try {
    const url = new URL(baseHref, 'https://example.com');
    if (utm) {
      Object.entries(utm).forEach(([key, value]) => {
        if (value) url.searchParams.set(key, value);
      });
    }
    const href = url.href.replace('https://example.com', '');
    return href;
  } catch {
    return baseHref;
  }
}



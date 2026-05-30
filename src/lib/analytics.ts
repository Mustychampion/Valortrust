/* eslint-disable @typescript-eslint/no-explicit-any */
interface VisitorInfo {
  ip: string;
  country: string;
  countryCode: string;
  city: string;
  region: string;
  isp: string;
  asn: string;
}

function getDevice(): string {
  const ua = navigator.userAgent;
  if (/tablet|ipad|playbook|silk/i.test(ua)) return 'Tablet';
  if (/mobile|iphone|ipod|android|blackberry|mini|windows\sce|palm/i.test(ua)) return 'Mobile';
  return 'Desktop';
}

async function getVisitorInfo(): Promise<VisitorInfo | null> {
  try {
    const res = await fetch('https://freeipapi.com/api/json');
    const data = await res.json() as Record<string, string>;
    if (!data['ipAddress']) return null;
    return {
      ip: data['ipAddress'],
      country: data['countryName'],
      countryCode: data['countryCode'],
      city: data['cityName'],
      region: data['regionName'],
      isp: data['org'] || 'Unknown',
      asn: data['asn'] || 'Unknown',
    };
  } catch {
    return null;
  }
}

export async function trackVisitor(): Promise<void> {
  try {
    const { supabase } = await import('./supabase');
    const info = await getVisitorInfo();
    if (!info) return;

    const device = getDevice();
    const pagePath = window.location.pathname;
    const db = supabase as any;

    // Check if IP already exists
    const { data: existing } = await db
      .from('visitor_logs')
      .select('id, visit_count')
      .eq('ip_address', info.ip)
      .single();

    if (existing) {
      await db
        .from('visitor_logs')
        .update({
          visit_count: ((existing.visit_count as number) || 1) + 1,
          last_seen: new Date().toISOString(),
          page_path: pagePath,
        })
        .eq('id', existing.id as string);
    } else {
      await db
        .from('visitor_logs')
        .insert([{
          ip_address: info.ip,
          country: info.country,
          country_code: info.countryCode,
          city: info.city,
          region: info.region,
          isp: info.isp,
          asn: info.asn,
          device: device,
          page_path: pagePath,
          visit_count: 1,
          first_seen: new Date().toISOString(),
          last_seen: new Date().toISOString(),
        }]);
    }
  } catch (err) {
    console.warn('Analytics error:', err);
  }
}
import { supabase } from './supabase';

interface VisitorInfo {
  ip_address: string;
  country: string | null;
  city: string | null;
  isp: string | null;
  asn: string | null;
  device_type: string;
}

function getDeviceType(): string {
  const ua = navigator.userAgent;
  if (/Mobi|Android|iPhone|iPad/i.test(ua)) return 'Mobile';
  return 'Desktop';
}

async function getVisitorInfo(): Promise<VisitorInfo> {
  // Default fallback in case all APIs fail
  const fallback: VisitorInfo = {
    ip_address: 'unknown',
    country: null,
    city: null,
    isp: null,
    asn: null,
    device_type: getDeviceType(),
  };

  // Try api.ipapi.is first (CORS-friendly, no redirect)
  try {
    const res = await fetch('https://api.ipapi.is/', { signal: AbortSignal.timeout(5000) });
    if (res.ok) {
      const data = await res.json();
      return {
        ip_address: data.ip || 'unknown',
        country: data.location?.country || null,
        city: data.location?.city || null,
        isp: data.company?.name || data.asn?.org || null,
        asn: data.asn?.asn ? `AS${data.asn.asn}` : null,
        device_type: getDeviceType(),
      };
    }
  } catch {
    // silently fall through to next API
  }

  // Fallback: ip-api.com
  try {
    const res = await fetch('https://ip-api.com/json/?fields=status,country,city,isp,as,query', {
      signal: AbortSignal.timeout(5000)
    });
    if (res.ok) {
      const data = await res.json();
      if (data.status === 'success') {
        return {
          ip_address: data.query || 'unknown',
          country: data.country || null,
          city: data.city || null,
          isp: data.isp || null,
          asn: data.as || null,
          device_type: getDeviceType(),
        };
      }
    }
  } catch {
    // silently fail
  }

  return fallback;
}

export async function trackVisitor(): Promise<void> {
  try {
    const info = await getVisitorInfo();

    // Check if this IP was already logged today
    const today = new Date().toISOString().split('T')[0];
    const visitorQuery = supabase.from('visitor_logs').select('id, visit_count') as any;
    const { data: existing } = await visitorQuery
      .eq('ip_address', info.ip_address)
      .gte('last_seen', today)
      .maybeSingle();

    if (existing) {
      // Update visit count
      const existingRow = existing as { id: string; visit_count: number };
      await (supabase.from('visitor_logs') as any)
        .update({
          visit_count: (existingRow.visit_count || 1) + 1,
          last_seen: new Date().toISOString(),
        })
        .eq('id', existingRow.id);
    } else {
      // Insert new visitor
      await (supabase.from('visitor_logs') as any).insert([{
        ...info,
        visit_count: 1,
        last_seen: new Date().toISOString(),
      }]);
    }
  } catch {
    // Analytics should never break the site — fail silently
  }
}

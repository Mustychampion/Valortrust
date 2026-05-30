import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';

type VisitorLogRow = Database['public']['Tables']['visitor_logs']['Row'];

export async function loadAnalyticsManager(container: HTMLElement) {
  container.innerHTML = `
    <div class="admin-card">
      <h3 class="text-lg font-bold text-gray-800 mb-6">Visitor Analytics</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" id="analytics-stats">
         <!-- Stats will load here -->
      </div>
      <h4 class="font-bold mb-4">Recent Visitors</h4>
      <div class="overflow-x-auto">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Last Seen</th>
                <th>IP Address</th>
                <th>Location</th>
                <th>Device</th>
                <th>Visits</th>
              </tr>
            </thead>
            <tbody id="analytics-table-body">
              <tr><td colspan="5" class="text-center">Loading...</td></tr>
            </tbody>
          </table>
      </div>
    </div>
  `;

  try {
    const { data, error, count } = await supabase.from('visitor_logs')
        .select('*', { count: 'exact' })
        .order('last_seen', { ascending: false })
        .limit(20) as { data: VisitorLogRow[] | null; error: any; count: number | null };
        
    if (error) throw error;

    const statsDiv = document.getElementById('analytics-stats');
    if (statsDiv) {
        const unique = count || 0;
        const totalVisits = data?.reduce((sum, item) => sum + (item.visit_count || 1), 0) || 0;
        
        statsDiv.innerHTML = `
            <div class="bg-gray-50 p-4 rounded border">
                <div class="text-sm text-gray-500">Total Unique Visitors</div>
                <div class="text-2xl font-bold">${unique}</div>
            </div>
            <div class="bg-gray-50 p-4 rounded border">
                <div class="text-sm text-gray-500">Total Views (Top 20)</div>
                <div class="text-2xl font-bold">${totalVisits}</div>
            </div>
        `;
    }

    const tbody = document.getElementById('analytics-table-body');
    if (tbody) {
      if (data && data.length > 0) {
        tbody.innerHTML = data.map(item => `
          <tr>
            <td>${new Date(item.last_seen).toLocaleString()}</td>
            <td class="font-mono text-sm">${item.ip_address} ${item.is_returning ? '<span class="text-xs bg-green-100 text-green-800 px-1 rounded ml-1">Returning</span>' : '<span class="text-xs bg-blue-100 text-blue-800 px-1 rounded ml-1">New</span>'}</td>
            <td>${item.city || '-'}, ${item.country || '-'}</td>
            <td>${item.device_type || 'Unknown'}</td>
            <td>${item.visit_count}</td>
          </tr>
        `).join('');
      } else {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center text-gray-500">No visitors logged yet.</td></tr>';
      }
    }
  } catch (err) {
    console.error(err);
  }
}

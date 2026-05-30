import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';

type SubscriberRow = Database['public']['Tables']['subscribers']['Row'];

export async function loadSubscribersManager(container: HTMLElement) {
  container.innerHTML = `
    <div class="admin-card">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-lg font-bold text-gray-800">Newsletter Subscribers</h3>
        <button id="export-csv" class="btn-primary"><i class="fas fa-download mr-2"></i> Export CSV</button>
      </div>
      <table class="admin-table">
        <thead>
          <tr>
            <th>Date Subscribed</th>
            <th>Email Address</th>
          </tr>
        </thead>
        <tbody id="sub-table-body">
          <tr><td colspan="2" class="text-center">Loading...</td></tr>
        </tbody>
      </table>
    </div>
  `;

  try {
    const { data, error } = await supabase.from('subscribers').select('*').order('created_at', { ascending: false }) as { data: SubscriberRow[] | null; error: any };
    if (error) throw error;
    
    const tbody = document.getElementById('sub-table-body');
    if (tbody) {
      if (data && data.length > 0) {
        tbody.innerHTML = data.map(item => `
          <tr>
            <td>${new Date(item.created_at).toLocaleDateString()}</td>
            <td class="font-medium">${item.email}</td>
          </tr>
        `).join('');

        document.getElementById('export-csv')?.addEventListener('click', () => {
            const csvContent = "data:text/csv;charset=utf-8," 
                + "Date,Email\n"
                + data.map(row => `${new Date(row.created_at).toISOString()},${row.email}`).join("\n");
            
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "subscribers.csv");
            document.body.appendChild(link);
            link.click();
            link.remove();
        });
      } else {
        tbody.innerHTML = '<tr><td colspan="2" class="text-center text-gray-500">No subscribers found.</td></tr>';
      }
    }
  } catch (err) {
    console.error(err);
  }
}

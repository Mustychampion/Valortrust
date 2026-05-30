import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';

type EnquiryRow = Database['public']['Tables']['enquiries']['Row'];

export async function loadEnquiriesManager(container: HTMLElement) {
  container.innerHTML = `
    <div class="admin-card">
      <h3 class="text-lg font-bold text-gray-800 mb-6">Contact Enquiries</h3>
      <table class="admin-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Name</th>
            <th>Email</th>
            <th>Sector</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="enq-table-body">
          <tr><td colspan="6" class="text-center">Loading...</td></tr>
        </tbody>
      </table>
    </div>
  `;

  try {
    const { data, error } = await supabase.from('enquiries').select('*').order('created_at', { ascending: false }) as { data: EnquiryRow[] | null; error: any };
    if (error) throw error;
    
    const tbody = document.getElementById('enq-table-body');
    if (tbody) {
      if (data && data.length > 0) {
        tbody.innerHTML = data.map(item => `
          <tr class="${item.status === 'unread' ? 'bg-blue-50' : ''}">
            <td>${new Date(item.created_at).toLocaleDateString()}</td>
            <td class="font-medium">${item.name}</td>
            <td><a href="mailto:${item.email}" class="text-blue-600 hover:underline">${item.email}</a></td>
            <td>${item.sector || '-'}</td>
            <td>${item.status.toUpperCase()}</td>
            <td>
              <button class="text-blue-600 mr-2 hover:underline">View</button>
            </td>
          </tr>
        `).join('');
      } else {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-gray-500">No enquiries found.</td></tr>';
      }
    }
  } catch (err) {
    console.error(err);
  }
}

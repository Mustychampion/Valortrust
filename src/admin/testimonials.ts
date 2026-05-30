import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';

type TestimonialRow = Database['public']['Tables']['testimonials']['Row'];

export async function loadTestimonialsManager(container: HTMLElement) {
  container.innerHTML = `
    <div class="admin-card">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-lg font-bold text-gray-800">Testimonials</h3>
        <button class="btn-primary"><i class="fas fa-plus mr-2"></i> Add Testimonial</button>
      </div>
      <table class="admin-table">
        <thead>
          <tr>
            <th>Client Name</th>
            <th>Company</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="test-table-body">
          <tr><td colspan="3" class="text-center">Loading...</td></tr>
        </tbody>
      </table>
    </div>
  `;

  try {
    const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false }) as { data: TestimonialRow[] | null; error: any };
    if (error) throw error;
    
    const tbody = document.getElementById('test-table-body');
    if (tbody) {
      if (data && data.length > 0) {
        tbody.innerHTML = data.map(item => `
          <tr>
            <td class="font-medium">${item.client_name}</td>
            <td>${item.company}</td>
            <td>
              <button class="text-blue-600 mr-2 hover:underline">Edit</button>
              <button class="text-red-600 hover:underline">Delete</button>
            </td>
          </tr>
        `).join('');
      } else {
        tbody.innerHTML = '<tr><td colspan="3" class="text-center text-gray-500">No testimonials found.</td></tr>';
      }
    }
  } catch (err) {
    console.error(err);
  }
}

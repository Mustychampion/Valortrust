import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';

type BlogPostRow = Database['public']['Tables']['blog_posts']['Row'];

export async function loadBlogManager(container: HTMLElement) {
  // Simplified for brevity in this response, a full implementation would include:
  // - List view of all posts
  // - Form for creating/editing posts with file upload to 'blog-images' bucket
  // - Delete functionality
  container.innerHTML = `
    <div class="admin-card">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-lg font-bold text-gray-800">Blog Posts</h3>
        <button class="btn-primary"><i class="fas fa-plus mr-2"></i> Add New Post</button>
      </div>
      <p class="text-gray-600 mb-4">Manage your blog content here. (Full CRUD implementation pending)</p>
      
      <!-- Placeholder for table -->
      <table class="admin-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="blog-table-body">
          <tr><td colspan="5" class="text-center">Loading...</td></tr>
        </tbody>
      </table>
    </div>
  `;

  try {
    const { data, error } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false }) as { data: BlogPostRow[] | null; error: any };
    if (error) throw error;
    
    const tbody = document.getElementById('blog-table-body');
    if (tbody) {
      if (data && data.length > 0) {
        tbody.innerHTML = data.map(post => `
          <tr>
            <td class="font-medium">${post.title}</td>
            <td>${post.category}</td>
            <td>${post.status}</td>
            <td>${new Date(post.created_at).toLocaleDateString()}</td>
            <td>
              <button class="text-blue-600 mr-2 hover:underline">Edit</button>
              <button class="text-red-600 hover:underline">Delete</button>
            </td>
          </tr>
        `).join('');
      } else {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center text-gray-500">No blog posts found.</td></tr>';
      }
    }
  } catch (err) {
    console.error(err);
  }
}

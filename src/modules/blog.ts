import { supabase } from '../lib/supabase';

interface BlogPost {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  image_url: string;
  slug: string;
  created_at: string;
}

export async function loadBlog(): Promise<void> {
  const container = document.getElementById('blog-posts-container');
  if (!container) return;

  const { data, error } = await (supabase as any)
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(3);

  if (error || !data?.length) return; // Keep hardcoded if no data

  container.innerHTML = (data as BlogPost[]).map(post => `
    <div class="bg-white rounded-xl shadow-lg overflow-hidden transition duration-500 hover:shadow-xl">
      ${post.image_url
        ? `<img src="${post.image_url}" alt="${post.title}" class="w-full h-48 object-cover" loading="lazy">`
        : `<div class="w-full h-48 bg-blue-900 flex items-center justify-center"><i class="fas fa-newspaper text-white text-5xl"></i></div>`
      }
      <div class="p-6">
        <span class="bg-blue-100 text-blue-900 text-xs font-medium px-2.5 py-0.5 rounded">${post.category || ''}</span>
        <h3 class="text-xl font-bold text-blue-900 mt-3 mb-2">${post.title}</h3>
        <p class="text-gray-600 mb-4">${post.excerpt || ''}</p>
        <a href="#blog-${post.slug}" class="text-yellow-500 font-medium hover:text-yellow-600 transition">Read Article →</a>
      </div>
    </div>`).join('');
}
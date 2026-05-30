import { supabase } from '../lib/supabase';

interface BlogPost {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  image_url: string;
  slug: string;
  status: string;
  published_at: string;
}

export async function loadBlog(): Promise<void> {
  const container = document.getElementById('blog-posts-container');
  if (!container) return;

  const { data, error } = await (supabase as any)
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(3);

  if (error || !data?.length) {
    container.innerHTML = `<div class="no-content">No blog posts yet. Check back soon!</div>`;
    return;
  }

  container.innerHTML = (data as BlogPost[]).map(post => `
    <div class="blog-card">
      ${post.image_url ? `<img src="${post.image_url}" alt="${post.title}" loading="lazy">` : ''}
      <div class="blog-card-body">
        <span class="blog-category">${post.category || ''}</span>
        <h3>${post.title}</h3>
        <p>${post.excerpt || ''}</p>
        <a href="#blog-${post.slug}" class="read-more">Read Article →</a>
      </div>
    </div>`).join('');
}
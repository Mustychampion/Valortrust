import { supabase } from '../lib/supabase';

interface Testimonial {
  id: string;
  client_name: string;
  role: string;
  company: string;
  review_text: string;
  photo_url: string;
}

export async function loadTestimonials(): Promise<void> {
  const container = document.getElementById('testimonials-container');
  if (!container) return;

  const { data, error } = await (supabase as any)
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !data?.length) {
    container.innerHTML = `<div class="no-content">No testimonials yet.</div>`;
    return;
  }

  container.innerHTML = (data as Testimonial[]).map(t => `
    <div class="testimonial-card">
      <div class="testimonial-header">
        ${t.photo_url
          ? `<img src="${t.photo_url}" alt="${t.client_name}" class="testimonial-photo" loading="lazy">`
          : `<div class="testimonial-avatar">${t.client_name?.charAt(0) || 'V'}</div>`
        }
        <div>
          <div class="testimonial-name">${t.client_name}</div>
          <div class="testimonial-role">${t.role || ''} ${t.company ? '· ' + t.company : ''}</div>
        </div>
      </div>
      <p class="testimonial-text">"${t.review_text}"</p>
    </div>`).join('');
}
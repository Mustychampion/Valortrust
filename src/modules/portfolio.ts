import { supabase } from '../lib/supabase';

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  description: string;
  image_url: string;
  link: string;
}

export async function loadPortfolio(): Promise<void> {
  const container = document.getElementById('portfolio-container');
  if (!container) return;

  const { data, error } = await (supabase as any)
    .from('portfolio')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !data?.length) {
    container.innerHTML = `<div class="no-content">No portfolio items yet.</div>`;
    return;
  }

  renderPortfolio(data as PortfolioItem[]);
  initFilters(data as PortfolioItem[]);
}

function renderPortfolio(items: PortfolioItem[]): void {
  const container = document.getElementById('portfolio-container');
  if (!container) return;
  container.innerHTML = items.map(item => `
    <div class="portfolio-card" data-category="${item.category}">
      ${item.image_url ? `<img src="${item.image_url}" alt="${item.title}" loading="lazy">` : ''}
      <div class="portfolio-card-body">
        <span class="portfolio-category">${item.category || ''}</span>
        <h3>${item.title}</h3>
        <p>${item.description || ''}</p>
        ${item.link ? `<a href="${item.link}" target="_blank" class="view-project">View Project →</a>` : ''}
      </div>
    </div>`).join('');
}

function initFilters(data: PortfolioItem[]): void {
  const filters = document.querySelectorAll<HTMLElement>('[data-filter]');
  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      const filtered = filter === 'all' ? data : data.filter(item => item.category === filter);
      renderPortfolio(filtered);
    });
  });
}
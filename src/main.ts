import './styles/main.css';
import { trackVisitor } from './lib/analytics';
import { initContactForm } from './modules/contactForm';
import { initNewsletter } from './modules/newsletter';
import { initNavigation } from './modules/navigation';
import { initAnimations } from './modules/animations';
import { loadBlog } from './modules/blog';
import { loadPortfolio } from './modules/portfolio';
import { loadTestimonials } from './modules/testimonials';

document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.startsWith('/admin')) {
    import('./admin/index');
    return;
  }

  // 1. Initialise analytics
  trackVisitor();

  // 2. Initialise UI modules
  initNavigation();
  initContactForm();
  initNewsletter();

  // 3. Load dynamic data from Supabase
  loadBlog();
  loadPortfolio();
  loadTestimonials();

  // 4. Initialise animations
  initAnimations();

  // Remove preloader
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.style.opacity = '0';
      setTimeout(() => preloader.remove(), 500);
    }, 500);
  }
});
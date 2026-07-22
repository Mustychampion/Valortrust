import { supabase } from '../lib/supabase';

export async function initContactForm(): Promise<void> {
  const form = document.querySelector('#contact form') as HTMLFormElement | null;
  if (!form) return;

  form.addEventListener('submit', async (e: Event) => {
    e.preventDefault();
    const btn = form.querySelector('button[type=submit]') as HTMLButtonElement;
    const originalText = btn.innerText;
    btn.innerText = 'Sending...';
    btn.disabled = true;

    const data = {
      name: (document.getElementById('name') as HTMLInputElement).value.trim(),
      email: (document.getElementById('email') as HTMLInputElement).value.trim(),
      phone: (document.getElementById('phone') as HTMLInputElement).value.trim(),
      sector: (document.getElementById('service') as HTMLSelectElement).value,
      message: (document.getElementById('message') as HTMLTextAreaElement).value.trim(),
    };

    try {
      const { error } = await (supabase as unknown as {
        from: (table: string) => {
          insert: (values: Array<Record<string, unknown>>) => Promise<{ error: unknown }>;
        };
      }).from('enquiries').insert([data]);
      if (error) throw error;

      // Show success message
      btn.innerText = '✓ Message Sent!';
      btn.style.background = '#16a34a';
      form.reset();

      setTimeout(() => {
        btn.innerText = originalText;
        btn.style.background = '';
        btn.disabled = false;
      }, 4000);

    } catch (err) {
      console.error('Contact form error:', err);
      btn.innerText = 'Failed — Try Again';
      btn.style.background = '#dc2626';
      setTimeout(() => {
        btn.innerText = originalText;
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    }
  });
}
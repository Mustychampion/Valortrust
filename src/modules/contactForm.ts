export interface ContactFormData {

  name: string;
  email: string;
  phone: string;
  sector: string;
  message: string;
}

export async function initContactForm(): Promise<void> {
  const form = document.getElementById('contact-form') as HTMLFormElement | null;
  if (!form) return;

  form.addEventListener('submit', async (e: Event) => {
    e.preventDefault();
    const btn = form.querySelector('button[type=submit]') as HTMLButtonElement;
    const originalText = btn.innerText;
    btn.innerText = 'Sending...';
    btn.disabled = true;

    const data: ContactFormData = {
      name: (document.getElementById('contact-name') as HTMLInputElement).value.trim(),
      email: (document.getElementById('contact-email') as HTMLInputElement).value.trim(),
      phone: (document.getElementById('contact-phone') as HTMLInputElement).value.trim(),
      sector: (document.getElementById('contact-sector') as HTMLSelectElement).value,
      message: (document.getElementById('contact-message') as HTMLTextAreaElement).value.trim(),
    };

    try {
      const workerUrl = import.meta.env.VITE_WORKER_URL || '';
      const res = await fetch(`${workerUrl}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed');
      showMessage(form, 'success', 'Message sent! We will get back to you shortly.');
      form.reset();
    } catch {
      showMessage(form, 'error', 'Something went wrong. Please try again.');
    } finally {
      btn.innerText = originalText;
      btn.disabled = false;
    }
  });
}

function showMessage(form: HTMLFormElement, type: 'success' | 'error', text: string): void {
  let msg = document.getElementById('form-message');
  if (!msg) {
    msg = document.createElement('div');
    msg.id = 'form-message';
    form.appendChild(msg);
  }
  msg.textContent = text;
  msg.className = type === 'success' ? 'form-success' : 'form-error';
  setTimeout(() => { if (msg) msg.textContent = ''; }, 5000);
}
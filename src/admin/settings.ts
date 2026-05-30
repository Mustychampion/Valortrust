export async function loadSettingsManager(container: HTMLElement) {
  container.innerHTML = `
    <div class="admin-card max-w-2xl">
      <h3 class="text-lg font-bold text-gray-800 mb-6">System Settings</h3>
      <p class="text-gray-600 mb-6 text-sm">Most settings are configured via environment variables. View current configuration below.</p>
      
      <div class="space-y-4">
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Supabase URL</label>
            <input type="text" class="w-full px-4 py-2 border rounded-lg bg-gray-50" value="${import.meta.env.VITE_SUPABASE_URL || 'Not Set'}" disabled>
        </div>
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Cloudflare Worker URL</label>
            <input type="text" class="w-full px-4 py-2 border rounded-lg bg-gray-50" value="${import.meta.env.VITE_WORKER_URL || 'Not Set'}" disabled>
        </div>
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Site URL</label>
            <input type="text" class="w-full px-4 py-2 border rounded-lg bg-gray-50" value="${import.meta.env.VITE_SITE_URL || 'Not Set'}" disabled>
        </div>
      </div>
    </div>
  `;
}

/* =====================================================
   PastorSite — Editor
   Inline site editing for authenticated pastors
   Depends on: Supabase JS CDN (window.supabase),
               SITE_SLUG, SUPABASE_URL, SUPABASE_ANON_KEY
               constants defined in index.html
   ===================================================== */

'use strict';

(() => {
  // ---- Supabase client ----
  const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // ---- State ----
  let siteRow = null;       // pastor_sites row for this slug
  let session = null;       // current auth session
  let pendingEdits = {};    // unsaved changes
  let editModeActive = false;

  // =====================================================
  // INIT — run on every page load
  // =====================================================
  const init = async () => {
    // 1. Load site content from Supabase
    await loadSiteContent();

    // 2. Handle magic link token in URL hash
    const { data: { session: urlSession } } = await sb.auth.getSession();
    session = urlSession;

    // 3. Show edit affordances if authenticated and is the site owner
    if (session && siteRow && session.user.id === siteRow.user_id) {
      injectFloatingEditButton();
    }

    // Auto-enter edit mode if arriving via magic link (hash contains token)
    if (window.location.hash.includes('access_token')) {
      // Supabase already exchanged the token — clean the URL
      history.replaceState(null, '', window.location.pathname);
      if (session && siteRow && session.user.id === siteRow.user_id) {
        enterEditMode();
      }
    }
  };

  // =====================================================
  // LOAD SITE CONTENT — hydrate DOM from pastor_sites
  // =====================================================
  const loadSiteContent = async () => {
    const { data, error } = await sb
      .from('pastor_sites')
      .select('*')
      .eq('site_slug', SITE_SLUG)
      .single();

    if (error || !data) return; // leave template defaults in place
    siteRow = data;

    // Map data-editable keys to DB columns
    const fieldMap = {
      'church-name':       data.church_name,
      'tagline':           data.tagline,
      'service-times':     data.service_times,
      'service-time-1':    data.service_time_1,
      'service-time-2':    data.service_time_2,
      'service-time-3':    data.service_time_3,
      'pastor-name':       data.pastor_name,
      'pastor-message':    data.pastor_message,
      'address':           data.address,
      'city-state-zip':    data.city_state_zip,
      'phone':             data.phone,
      'about-text':        data.about_text,
    };

    Object.entries(fieldMap).forEach(([key, value]) => {
      if (!value) return;
      document.querySelectorAll(`[data-editable="${key}"]`).forEach(el => {
        el.textContent = value;
      });
    });

    // SEO meta (head elements)
    if (data.church_name) {
      const titleEl = document.querySelector('[data-editable="page-title"]');
      if (titleEl) titleEl.textContent = `${data.church_name} — ${data.city_state_zip || ''}`.trim().replace(/—\s*$/, '');
    }

    // CSS color variables
    if (data.primary_color) {
      document.documentElement.style.setProperty('--primary', data.primary_color);
      document.documentElement.style.setProperty('--primary-dark', darken(data.primary_color, 15));
      document.documentElement.style.setProperty('--primary-light', lighten(data.primary_color, 15));
    }
    if (data.accent_color) {
      document.documentElement.style.setProperty('--accent', data.accent_color);
      document.documentElement.style.setProperty('--accent-light', lighten(data.accent_color, 20));
    }

    // Logo
    if (data.logo_url) {
      document.querySelectorAll('img[data-logo]').forEach(img => {
        img.src = data.logo_url;
        img.hidden = false;
      });
    }
  };

  // =====================================================
  // ENTER EDIT MODE
  // =====================================================
  const enterEditMode = () => {
    if (editModeActive) return;
    editModeActive = true;

    // Inject editor CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'css/editor.css';
    link.id = 'ps-editor-css';
    document.head.appendChild(link);

    // Push body down
    document.body.classList.add('ps-edit-mode');

    // Remove floating button if present
    document.getElementById('ps-float-edit-btn')?.remove();

    // Inject toolbar
    injectToolbar();

    // Make all data-editable fields contenteditable
    document.querySelectorAll('[data-editable]').forEach(el => {
      const key = el.dataset.editable;
      // Skip head meta elements — handled via SEO modal
      if (key === 'page-title' || key === 'meta-description') return;
      el.contentEditable = 'true';
      el.addEventListener('input', () => onFieldInput(key, el.textContent.trim()));
      el.addEventListener('blur',  () => onFieldInput(key, el.textContent.trim()));
    });

    // Dirty state guard
    window.addEventListener('beforeunload', beforeUnloadGuard);
  };

  // =====================================================
  // EXIT EDIT MODE
  // =====================================================
  const exitEditMode = (saved = false) => {
    editModeActive = false;
    pendingEdits = {};

    document.body.classList.remove('ps-edit-mode');
    document.getElementById('ps-editor-toolbar')?.remove();
    document.getElementById('ps-editor-css')?.remove();
    document.getElementById('ps-color-popover')?.remove();

    document.querySelectorAll('[data-editable]').forEach(el => {
      el.removeAttribute('contenteditable');
    });

    window.removeEventListener('beforeunload', beforeUnloadGuard);

    // Re-show floating button
    injectFloatingEditButton();

    if (saved) showToast('Changes saved!', 'success');
  };

  // =====================================================
  // TOOLBAR
  // =====================================================
  const injectToolbar = () => {
    const bar = document.createElement('div');
    bar.id = 'ps-editor-toolbar';
    bar.className = 'ps-editor-toolbar';
    bar.innerHTML = `
      <span class="ps-editor-badge">
        <span class="ps-editor-badge-dot"></span>
        Editing
      </span>
      <div class="ps-editor-sep"></div>
      <button class="ps-editor-btn ps-editor-btn-ghost" id="ps-btn-colors">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/></svg>
        Brand Colors
      </button>
      <button class="ps-editor-btn ps-editor-btn-ghost" id="ps-btn-logo">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
        Logo
      </button>
      <button class="ps-editor-btn ps-editor-btn-ghost" id="ps-btn-seo">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        SEO
      </button>
      <div class="ps-editor-sep"></div>
      <button class="ps-editor-btn ps-editor-btn-primary" id="ps-btn-save">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
        Save &amp; Publish
      </button>
      <button class="ps-editor-btn ps-editor-btn-danger" id="ps-btn-exit">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        Exit
      </button>
      <input type="file" id="ps-logo-input" accept=".png,.svg,.jpg,.jpeg,.webp" hidden />
    `;
    document.body.prepend(bar);

    document.getElementById('ps-btn-save').addEventListener('click', saveChanges);
    document.getElementById('ps-btn-exit').addEventListener('click', () => {
      if (Object.keys(pendingEdits).length > 0) {
        if (!confirm('You have unsaved changes. Exit without saving?')) return;
      }
      exitEditMode(false);
    });
    document.getElementById('ps-btn-colors').addEventListener('click', toggleColorPopover);
    document.getElementById('ps-btn-logo').addEventListener('click', () => {
      document.getElementById('ps-logo-input').click();
    });
    document.getElementById('ps-logo-input').addEventListener('change', handleLogoUpload);
    document.getElementById('ps-btn-seo').addEventListener('click', openSeoModal);
  };

  // =====================================================
  // FLOATING EDIT BUTTON (return visits)
  // =====================================================
  const injectFloatingEditButton = () => {
    if (document.getElementById('ps-float-edit-btn')) return;

    // Inject editor CSS for the float button
    if (!document.getElementById('ps-editor-css')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'css/editor.css';
      link.id = 'ps-editor-css';
      document.head.appendChild(link);
    }

    const btn = document.createElement('button');
    btn.id = 'ps-float-edit-btn';
    btn.className = 'ps-float-edit-btn';
    btn.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
      Edit My Site
    `;
    btn.addEventListener('click', enterEditMode);
    document.body.appendChild(btn);
  };

  // =====================================================
  // FIELD INPUT HANDLER
  // =====================================================
  const fieldToColumn = {
    'church-name':    'church_name',
    'tagline':        'tagline',
    'service-times':  'service_times',
    'service-time-1': 'service_time_1',
    'service-time-2': 'service_time_2',
    'service-time-3': 'service_time_3',
    'pastor-name':    'pastor_name',
    'pastor-message': 'pastor_message',
    'address':        'address',
    'city-state-zip': 'city_state_zip',
    'phone':          'phone',
    'about-text':     'about_text',
  };

  const onFieldInput = (key, value) => {
    const col = fieldToColumn[key];
    if (col) pendingEdits[col] = value;
  };

  // =====================================================
  // SAVE CHANGES
  // =====================================================
  const saveChanges = async () => {
    if (!session || !siteRow) return;
    const btn = document.getElementById('ps-btn-save');
    if (btn) { btn.disabled = true; btn.textContent = 'Saving…'; }

    const { error } = await sb
      .from('pastor_sites')
      .update(pendingEdits)
      .eq('user_id', session.user.id)
      .eq('site_slug', SITE_SLUG);

    if (btn) { btn.disabled = false; btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Save &amp; Publish`; }

    if (error) {
      showToast('Save failed — please try again', 'error');
    } else {
      // Update local siteRow with saved values
      siteRow = { ...siteRow, ...pendingEdits };
      exitEditMode(true);
    }
  };

  // =====================================================
  // COLOR POPOVER
  // =====================================================
  const PRIMARY_SWATCHES = [
    { hex: '#6B2737', name: 'Burgundy' },
    { hex: '#1B4332', name: 'Forest' },
    { hex: '#1A3A6B', name: 'Navy' },
    { hex: '#7C2D12', name: 'Terracotta' },
    { hex: '#312E81', name: 'Indigo' },
    { hex: '#374151', name: 'Slate' },
  ];
  const ACCENT_SWATCHES = [
    { hex: '#C9882A', name: 'Gold' },
    { hex: '#D97706', name: 'Amber' },
    { hex: '#0891B2', name: 'Teal' },
    { hex: '#16A34A', name: 'Green' },
    { hex: '#DC2626', name: 'Red' },
    { hex: '#7C3AED', name: 'Purple' },
  ];

  let tempPrimary = siteRow?.primary_color || '#6B2737';
  let tempAccent  = siteRow?.accent_color  || '#C9882A';

  const buildSwatches = (swatches, current, onChange) => {
    return swatches.map(s => {
      const active = s.hex.toLowerCase() === current.toLowerCase() ? 'active' : '';
      return `<button class="ps-swatch ${active}" style="--c:${s.hex}" data-color="${s.hex}" aria-label="${s.name}" title="${s.name}"></button>`;
    }).join('');
  };

  const toggleColorPopover = () => {
    const existing = document.getElementById('ps-color-popover');
    if (existing) { existing.remove(); return; }

    tempPrimary = siteRow?.primary_color || '#6B2737';
    tempAccent  = siteRow?.accent_color  || '#C9882A';

    const pop = document.createElement('div');
    pop.id = 'ps-color-popover';
    pop.className = 'ps-color-popover';
    pop.innerHTML = `
      <h4>Brand Colors</h4>
      <div class="ps-color-row">
        <div class="ps-color-label">Primary (header &amp; buttons)</div>
        <div class="ps-swatches" id="ps-primary-swatches">${buildSwatches(PRIMARY_SWATCHES, tempPrimary, () => {})}</div>
        <div class="ps-color-custom">
          <label for="ps-custom-primary">Custom</label>
          <input type="color" id="ps-custom-primary" value="${tempPrimary}" />
        </div>
      </div>
      <div class="ps-color-row">
        <div class="ps-color-label">Accent (highlights &amp; links)</div>
        <div class="ps-swatches" id="ps-accent-swatches">${buildSwatches(ACCENT_SWATCHES, tempAccent, () => {})}</div>
        <div class="ps-color-custom">
          <label for="ps-custom-accent">Custom</label>
          <input type="color" id="ps-custom-accent" value="${tempAccent}" />
        </div>
      </div>
      <div class="ps-color-popover-actions">
        <button class="ps-editor-btn ps-editor-btn-ghost" id="ps-colors-cancel">Cancel</button>
        <button class="ps-editor-btn ps-editor-btn-primary" id="ps-colors-apply">Apply</button>
      </div>
    `;
    document.body.appendChild(pop);

    // Primary swatches
    pop.querySelector('#ps-primary-swatches').addEventListener('click', e => {
      const sw = e.target.closest('.ps-swatch');
      if (!sw) return;
      tempPrimary = sw.dataset.color;
      pop.querySelectorAll('#ps-primary-swatches .ps-swatch').forEach(s => s.classList.toggle('active', s.dataset.color === tempPrimary));
      pop.querySelector('#ps-custom-primary').value = tempPrimary;
      applyColorPreview();
    });

    pop.querySelector('#ps-custom-primary').addEventListener('input', e => {
      tempPrimary = e.target.value;
      pop.querySelectorAll('#ps-primary-swatches .ps-swatch').forEach(s => s.classList.remove('active'));
      applyColorPreview();
    });

    // Accent swatches
    pop.querySelector('#ps-accent-swatches').addEventListener('click', e => {
      const sw = e.target.closest('.ps-swatch');
      if (!sw) return;
      tempAccent = sw.dataset.color;
      pop.querySelectorAll('#ps-accent-swatches .ps-swatch').forEach(s => s.classList.toggle('active', s.dataset.color === tempAccent));
      pop.querySelector('#ps-custom-accent').value = tempAccent;
      applyColorPreview();
    });

    pop.querySelector('#ps-custom-accent').addEventListener('input', e => {
      tempAccent = e.target.value;
      pop.querySelectorAll('#ps-accent-swatches .ps-swatch').forEach(s => s.classList.remove('active'));
      applyColorPreview();
    });

    pop.querySelector('#ps-colors-apply').addEventListener('click', () => {
      pendingEdits.primary_color = tempPrimary;
      pendingEdits.accent_color  = tempAccent;
      pop.remove();
    });

    pop.querySelector('#ps-colors-cancel').addEventListener('click', () => {
      // Revert preview to saved values
      const savedPrimary = siteRow?.primary_color || '#6B2737';
      const savedAccent  = siteRow?.accent_color  || '#C9882A';
      document.documentElement.style.setProperty('--primary', savedPrimary);
      document.documentElement.style.setProperty('--accent',  savedAccent);
      pop.remove();
    });
  };

  const applyColorPreview = () => {
    document.documentElement.style.setProperty('--primary', tempPrimary);
    document.documentElement.style.setProperty('--primary-dark',  darken(tempPrimary, 15));
    document.documentElement.style.setProperty('--primary-light', lighten(tempPrimary, 15));
    document.documentElement.style.setProperty('--accent',       tempAccent);
    document.documentElement.style.setProperty('--accent-light', lighten(tempAccent, 20));
  };

  // =====================================================
  // LOGO UPLOAD
  // =====================================================
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { showToast('Logo must be under 2MB', 'error'); return; }

    showToast('Uploading logo…');
    const ext = file.name.split('.').pop();
    const path = `${SITE_SLUG}/logo.${ext}`;

    const { error: uploadError } = await sb.storage
      .from('church-logos')
      .upload(path, file, { upsert: true });

    if (uploadError) { showToast('Upload failed', 'error'); return; }

    const { data: { publicUrl } } = sb.storage
      .from('church-logos')
      .getPublicUrl(path);

    // Update DOM
    document.querySelectorAll('img[data-logo]').forEach(img => {
      img.src = publicUrl;
      img.hidden = false;
    });

    pendingEdits.logo_url = publicUrl;
    showToast('Logo updated — save to publish', 'success');
  };

  // =====================================================
  // SEO MODAL
  // =====================================================
  const openSeoModal = () => {
    const titleEl = document.querySelector('[data-editable="page-title"]');
    const metaEl  = document.querySelector('[data-editable="meta-description"]');

    const overlay = document.createElement('div');
    overlay.className = 'ps-meta-modal-overlay';
    overlay.innerHTML = `
      <div class="ps-meta-modal">
        <h4>SEO Settings</h4>
        <div class="ps-meta-field">
          <label for="ps-meta-title">Page Title</label>
          <input type="text" id="ps-meta-title" value="${titleEl?.textContent || ''}" maxlength="70" />
        </div>
        <div class="ps-meta-field">
          <label for="ps-meta-desc">Meta Description</label>
          <textarea id="ps-meta-desc" rows="3" maxlength="160">${metaEl?.getAttribute('content') || ''}</textarea>
        </div>
        <div class="ps-meta-modal-actions">
          <button class="ps-editor-btn ps-editor-btn-ghost" id="ps-meta-cancel">Cancel</button>
          <button class="ps-editor-btn ps-editor-btn-primary" id="ps-meta-apply">Apply</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    overlay.querySelector('#ps-meta-apply').addEventListener('click', () => {
      const newTitle = overlay.querySelector('#ps-meta-title').value.trim();
      const newDesc  = overlay.querySelector('#ps-meta-desc').value.trim();
      if (titleEl) titleEl.textContent = newTitle;
      if (metaEl)  metaEl.setAttribute('content', newDesc);
      pendingEdits.page_title       = newTitle;
      pendingEdits.meta_description = newDesc;
      overlay.remove();
    });

    overlay.querySelector('#ps-meta-cancel').addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  };

  // =====================================================
  // TOAST
  // =====================================================
  let toastTimer = null;
  const showToast = (msg, type = '') => {
    document.getElementById('ps-toast')?.remove();
    clearTimeout(toastTimer);

    const icon = type === 'success'
      ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>'
      : type === 'error'
      ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>'
      : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';

    const toast = document.createElement('div');
    toast.id = 'ps-toast';
    toast.className = `ps-toast ${type}`;
    toast.innerHTML = `${icon} ${msg}`;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));

    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 250);
    }, 3000);
  };

  // =====================================================
  // BEFOREUNLOAD GUARD
  // =====================================================
  const beforeUnloadGuard = (e) => {
    if (Object.keys(pendingEdits).length > 0) {
      e.preventDefault();
      e.returnValue = '';
    }
  };

  // =====================================================
  // COLOR HELPERS
  // =====================================================
  const hexToRgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
  };

  const rgbToHex = (r, g, b) =>
    '#' + [r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');

  const darken = (hex, amount) => {
    const [r, g, b] = hexToRgb(hex);
    return rgbToHex(r - amount, g - amount, b - amount);
  };

  const lighten = (hex, amount) => {
    const [r, g, b] = hexToRgb(hex);
    return rgbToHex(r + amount, g + amount, b + amount);
  };

  // =====================================================
  // BOOT
  // =====================================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

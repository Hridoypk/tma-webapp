/* ══════════════════════════════════════════════════════════════════
   AAMVA Premium — Telegram Mini App Logic
   ══════════════════════════════════════════════════════════════════ */

// ─── State Data (mirrors TG.py STATES registry) ─────────────────
const STATES = [
  { code: "AL", name: "Alabama", status: "active" },
  { code: "AK", name: "Alaska", status: "active" },
  { code: "AZ", name: "Arizona", status: "active" },
  { code: "AR", name: "Arkansas", status: "active" },
  { code: "CA", name: "California", status: "active", tag: "new" },
  { code: "CO", name: "Colorado", status: "active" },
  { code: "CT", name: "Connecticut", status: "active" },
  { code: "DE", name: "Delaware", status: "active" },
  { code: "DC", name: "D.C.", status: "active" },
  { code: "FL", name: "Florida", status: "active" },
  { code: "GA", name: "Georgia", status: "active" },
  { code: "HI", name: "Hawaii", status: "active" },
  { code: "ID", name: "Idaho", status: "active" },
  { code: "IL", name: "Illinois", status: "active" },
  { code: "IN", name: "Indiana", status: "active" },
  { code: "IA", name: "Iowa", status: "active" },
  { code: "KS", name: "Kansas", status: "active" },
  { code: "KY", name: "Kentucky", status: "active" },
  { code: "LA", name: "Louisiana", status: "active" },
  { code: "ME", name: "Maine", status: "active" },
  { code: "MD", name: "Maryland", status: "active" },
  { code: "MA", name: "Massachusetts", status: "active" },
  { code: "MI", name: "Michigan", status: "active" },
  { code: "MN", name: "Minnesota", status: "active" },
  { code: "MS", name: "Mississippi", status: "active" },
  { code: "MO", name: "Missouri", status: "active" },
  { code: "MT", name: "Montana", status: "active" },
  { code: "NE", name: "Nebraska", status: "active" },
  { code: "NV", name: "Nevada", status: "active" },
  { code: "NH", name: "New Hampshire", status: "active" },
  { code: "NJ", name: "New Jersey", status: "active" },
  { code: "NM", name: "New Mexico", status: "active" },
  { code: "NY", name: "New York", status: "active" },
  { code: "NC", name: "N. Carolina", status: "active" },
  { code: "ND", name: "N. Dakota", status: "active" },
  { code: "OH", name: "Ohio", status: "active" },
  { code: "OK", name: "Oklahoma", status: "active" },
  { code: "OR", name: "Oregon", status: "active" },
  { code: "PA", name: "Pennsylvania", status: "active" },
  { code: "RI", name: "Rhode Island", status: "active" },
  { code: "SC", name: "S. Carolina", status: "active" },
  { code: "SD", name: "S. Dakota", status: "active" },
  { code: "TN", name: "Tennessee", status: "active" },
  { code: "TX", name: "Texas", status: "active" },
  { code: "UT", name: "Utah", status: "active" },
  { code: "VT", name: "Vermont", status: "active" },
  { code: "VA", name: "Virginia", status: "active" },
  { code: "WA", name: "Washington", status: "active", tag: "new" },
  { code: "WV", name: "W. Virginia", status: "active" },
  { code: "WI", name: "Wisconsin", status: "active" },
  { code: "WY", name: "Wyoming", status: "active" },
];

// ─── Per-state form fields (mirrors STATE_FIELD_REQS in TG.py) ──
const FIELD_DEFS = {
  DCS: { label: "Last Name", type: "text", placeholder: "DOE", required: true, section: "personal" },
  DAC: { label: "First Name", type: "text", placeholder: "JOHN", required: true, section: "personal" },
  DAD: { label: "Middle Name", type: "text", placeholder: "MICHAEL", required: false, section: "personal" },
  DBC: { label: "Sex", type: "select", options: [["1","Male"],["2","Female"],["9","Non-Binary"]], required: true, section: "personal" },
  DBB: { label: "Date of Birth", type: "date", placeholder: "MM/DD/YYYY", required: true, section: "personal" },
  DAU: { label: "Height (in)", type: "text", placeholder: "510 or 5'10", required: true, section: "physical" },
  DAW: { label: "Weight (lbs)", type: "number", placeholder: "180", required: false, section: "physical" },
  DAY: { label: "Eye Color", type: "select", options: [["BLK","Black"],["BLU","Blue"],["BRO","Brown"],["GRY","Gray"],["GRN","Green"],["HAZ","Hazel"]], required: true, section: "physical" },
  DAZ: { label: "Hair Color", type: "select", options: [["BAL","Bald"],["BLK","Black"],["BLN","Blond"],["BRO","Brown"],["GRY","Gray"],["RED","Red"],["WHI","White"]], required: false, section: "physical" },
  DAG: { label: "Street Address", type: "text", placeholder: "123 MAIN ST", required: true, section: "address" },
  DAH: { label: "Address Line 2", type: "text", placeholder: "APT 4B", required: false, section: "address" },
  DAI: { label: "City", type: "text", placeholder: "HOUSTON", required: true, section: "address" },
  DAK: { label: "ZIP Code", type: "text", placeholder: "770010000", required: true, section: "address" },
  DCA: { label: "DL Class", type: "text", placeholder: "C", required: true, section: "document" },
  DCB: { label: "Restrictions", type: "text", placeholder: "NONE", required: false, section: "document" },
  DCD: { label: "Endorsements", type: "text", placeholder: "NONE", required: false, section: "document" },
  DDK: { label: "Organ Donor", type: "select", options: [["0","No"],["1","Yes"]], required: false, section: "physical" },
  DCU: { label: "Name Suffix", type: "text", placeholder: "JR, SR, III", required: false, section: "personal" },
  DCE: { label: "Weight Range", type: "select", options: [["0","≤70"],["1","71-100"],["2","101-130"],["3","131-160"],["4","161-190"],["5","191-220"],["6","221-250"],["7","251-280"],["8","281-320"],["9","321+"]], required: false, section: "physical" },
  DCL: { label: "Race/Ethnicity", type: "select", options: [["W","White"],["B","Black"],["H","Hispanic"],["A","Asian"],["I","Native American"],["U","Unknown"]], required: false, section: "physical" },
};

// Default field list for states not explicitly mapped
const DEFAULT_MANDATORY = ["DCS","DAC","DBC","DBB","DAU","DAY","DAG","DAI","DAK","DCA"];
const DEFAULT_OPTIONAL  = ["DAD","DAW","DAZ","DCB","DCD"];

// Per-state overrides (from TG.py STATE_FIELD_REQS)
const STATE_FIELDS = {
  TX: { mandatory: ["DCS","DAC","DBC","DBB","DAU","DAY","DAG","DAI","DAK","DCA"], optional: ["DAD","DAW","DAZ","DCL","DDK","DCB","DCD"] },
  FL: { mandatory: ["DCS","DAC","DBC","DBB","DAU","DAY","DAG","DAI","DAK","DCA"], optional: ["DAD","DCB","DCD"] },
  CA: { mandatory: ["DCS","DAC","DBC","DBB","DAU","DAW","DAY","DAZ","DAG","DAI","DAK","DCA"], optional: ["DAD","DCB","DCD"] },
  IL: { mandatory: ["DCS","DAC","DBC","DBB","DAU","DAW","DAY","DAZ","DAG","DAI","DAK","DCA"], optional: ["DAD","DCU","DCB","DCD"] },
  IN: { mandatory: ["DCS","DAC","DBC","DBB","DAU","DAW","DAY","DAZ","DAG","DAI","DAK","DCA"], optional: ["DAD","DDK","DCB","DCD"] },
  NV: { mandatory: ["DCS","DAC","DBC","DBB","DAU","DAY","DAG","DAI","DAK","DCA"], optional: ["DAD","DAH","DAZ","DCE","DCU","DCB","DCD"] },
  OH: { mandatory: ["DCS","DAC","DBC","DBB","DAU","DAY","DAG","DAI","DAK","DCA"], optional: ["DAD","DAW","DAZ","DCE","DCU","DDK","DCB","DCD"] },
  NY: { mandatory: ["DCS","DAC","DBC","DBB","DAU","DAY","DAG","DAI","DAK","DCA"], optional: ["DAD","DCB","DCD"] },
  PA: { mandatory: ["DCS","DAC","DBC","DBB","DAU","DAY","DAG","DAI","DAK","DCA"], optional: ["DAD","DCB","DCD"] },
};

// ─── App State ──────────────────────────────────────────────────
let currentView = 'dashboard';
let selectedState = null;
let formMode = 'semi_auto'; // manual | semi_auto | full_auto
let tg = null;

// ─── Telegram SDK Init ──────────────────────────────────────────
function initTelegram() {
  if (window.Telegram && window.Telegram.WebApp) {
    tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();
    tg.enableClosingConfirmation();

    // Apply Telegram theme
    document.documentElement.style.setProperty('--tg-bg', tg.themeParams.bg_color || '#0d1117');
    document.documentElement.style.setProperty('--tg-text', tg.themeParams.text_color || '#e6edf3');
    document.documentElement.style.setProperty('--tg-hint', tg.themeParams.hint_color || '#8b949e');
    document.documentElement.style.setProperty('--tg-secondary-bg', tg.themeParams.secondary_bg_color || '#161b22');
  } else {
    console.log('[TMA] Running outside Telegram — using mock environment');
  }
}

// ─── View Navigation ────────────────────────────────────────────
function showView(viewId) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const target = document.getElementById(viewId);
  if (target) {
    target.classList.add('active');
    currentView = viewId;
  }

  // BackButton
  if (tg) {
    if (viewId === 'dashboard') {
      tg.BackButton.hide();
      tg.MainButton.hide();
    } else if (viewId === 'states-view') {
      tg.BackButton.show();
      tg.MainButton.hide();
    } else if (viewId === 'form-view') {
      tg.BackButton.show();
      tg.MainButton.setText('✨ Generate Barcode');
      tg.MainButton.show();
      tg.MainButton.color = '#00d26a';
    }
  }

  // Haptic
  if (tg && tg.HapticFeedback) {
    tg.HapticFeedback.impactOccurred('light');
  }
}

// ─── Dashboard Rendering ────────────────────────────────────────
function renderDashboard() {
  const user = tg?.initDataUnsafe?.user;
  const firstName = user?.first_name || 'User';

  // Welcome
  const greetEl = document.getElementById('welcome-name');
  if (greetEl) greetEl.textContent = firstName;

  // Stats (these would come from the bot via initData in production)
  updateStat('stat-states', STATES.length);
  updateStat('stat-gens', '—');
  updateStat('stat-credits', '—');
  updateStat('stat-tier', '—');

  // Meters
  setMeter('meter-states', 100);
  setMeter('meter-gens', 0);
  setMeter('meter-credits', 0);
}

function updateStat(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function setMeter(id, pct) {
  const el = document.getElementById(id);
  if (el) el.style.width = Math.min(pct, 100) + '%';
}

// ─── State Grid ─────────────────────────────────────────────────
function renderStateGrid(filter = '') {
  const grid = document.getElementById('state-grid');
  if (!grid) return;

  const filtered = STATES.filter(s =>
    s.name.toLowerCase().includes(filter.toLowerCase()) ||
    s.code.toLowerCase().includes(filter.toLowerCase())
  );

  grid.innerHTML = filtered.map((s, i) => `
    <div class="state-card ${s.tag ? 'new-tag' : ''}" data-code="${s.code}"
         onclick="selectState('${s.code}')"
         role="listitem" tabindex="0"
         aria-label="${s.name}"
         style="animation-delay: ${Math.min(i * 20, 400)}ms">
      <span class="state-code">${s.code}</span>
      <span class="state-name">${s.name}</span>
      <span class="state-status ${s.status}"></span>
    </div>
  `).join('');

  // Update count
  const countEl = document.getElementById('state-count');
  if (countEl) countEl.textContent = filtered.length;
}

function selectState(code) {
  selectedState = STATES.find(s => s.code === code);
  if (!selectedState) return;

  if (tg && tg.HapticFeedback) {
    tg.HapticFeedback.impactOccurred('medium');
  }

  renderForm(code);
  showView('form-view');
}

// ─── Form Rendering ─────────────────────────────────────────────
function renderForm(stateCode) {
  // Header
  const badge = document.getElementById('form-badge');
  const title = document.getElementById('form-title');
  const subtitle = document.getElementById('form-subtitle');
  const state = STATES.find(s => s.code === stateCode);

  if (badge) badge.textContent = stateCode;
  if (title) title.textContent = state?.name || stateCode;
  if (subtitle) subtitle.textContent = `AAMVA Compliant · PDF417`;

  // Get field config
  const config = STATE_FIELDS[stateCode] || { mandatory: DEFAULT_MANDATORY, optional: DEFAULT_OPTIONAL };

  // Build sections
  const sections = { personal: [], physical: [], address: [], document: [] };
  // SVG icons for section headers (no emoji per UX skill)
  const sectionIcons = {
    personal: '<svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    physical: '<svg viewBox="0 0 24 24"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>',
    address: '<svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    document: '<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>'
  };
  const sectionLabels = {
    personal: 'Personal Information',
    physical: 'Physical Description',
    address: 'Address',
    document: 'Document Details'
  };

  // Add mandatory fields
  config.mandatory.forEach(key => {
    const def = FIELD_DEFS[key];
    if (def) {
      sections[def.section].push({ key, ...def, required: true });
    }
  });

  // Add optional fields
  config.optional.forEach(key => {
    const def = FIELD_DEFS[key];
    if (def) {
      sections[def.section].push({ key, ...def, required: false });
    }
  });

  // Render
  const container = document.getElementById('form-fields');
  if (!container) return;

  let html = '';
  for (const [sectionKey, fields] of Object.entries(sections)) {
    if (fields.length === 0) continue;

    html += `<div class="form-section">
      <div class="form-section-title">${sectionIcons[sectionKey]} ${sectionLabels[sectionKey]}</div>
      <div class="form-row">`;

    fields.forEach((f, i) => {
      // Start new row every 2 fields (or use full width for address)
      if (i > 0 && i % 2 === 0) {
        html += `</div><div class="form-row">`;
      }

      html += `<div class="form-group">
        <label class="form-label" for="field-${f.key}">${f.label} ${f.required ? '<span class="required">*</span>' : ''}</label>`;

      if (f.type === 'select' && f.options) {
        html += `<select class="form-select" id="field-${f.key}" data-field="${f.key}" ${f.required ? 'required' : ''}>
          <option value="">Select...</option>
          ${f.options.map(([val, text]) => `<option value="${val}">${text}</option>`).join('')}
        </select>`;
      } else if (f.type === 'date') {
        html += `<input class="form-input" type="text" id="field-${f.key}" data-field="${f.key}"
          placeholder="${f.placeholder || ''}" ${f.required ? 'required' : ''} inputmode="numeric">`;
      } else if (f.type === 'number') {
        html += `<input class="form-input" type="number" id="field-${f.key}" data-field="${f.key}"
          placeholder="${f.placeholder || ''}" ${f.required ? 'required' : ''} inputmode="numeric">`;
      } else {
        html += `<input class="form-input" type="text" id="field-${f.key}" data-field="${f.key}"
          placeholder="${f.placeholder || ''}" ${f.required ? 'required' : ''} autocapitalize="characters">`;
      }

      html += `</div>`;
    });

    html += `</div></div>`;
  }

  // Auto-ID preview
  html += `
    <div class="auto-ids-card">
      <div class="auto-ids-title">
        <svg viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
        Auto-Generated IDs
      </div>
      <div class="auto-id-row">
        <span class="auto-id-label">DL Number</span>
        <span class="auto-id-value" id="preview-daq">Auto</span>
      </div>
      <div class="auto-id-row">
        <span class="auto-id-label">Doc Discriminator</span>
        <span class="auto-id-value" id="preview-dcf">Auto</span>
      </div>
      <div class="auto-id-row">
        <span class="auto-id-label">Inventory Control</span>
        <span class="auto-id-value" id="preview-dck">Auto</span>
      </div>
      <div class="auto-id-row">
        <span class="auto-id-label">Issue Date</span>
        <span class="auto-id-value" id="preview-dbd">Auto</span>
      </div>
      <div class="auto-id-row">
        <span class="auto-id-label">Expiry Date</span>
        <span class="auto-id-value" id="preview-dba">Auto</span>
      </div>
    </div>`;

  container.innerHTML = html;

  // Update progress
  updateFormProgress();
}

// ─── Form Progress ──────────────────────────────────────────────
function updateFormProgress() {
  const fields = document.querySelectorAll('#form-fields [data-field]');
  const required = [...fields].filter(f => f.hasAttribute('required'));
  const filled = required.filter(f => f.value.trim() !== '');
  const pct = required.length ? Math.round(filled.length / required.length * 100) : 0;

  const bar = document.getElementById('progress-fill');
  const label = document.getElementById('progress-label');
  if (bar) bar.style.width = pct + '%';
  if (label) label.textContent = `${filled.length}/${required.length} fields`;
}

// ─── Form Submission ────────────────────────────────────────────
function submitForm() {
  if (!selectedState) return;

  const fields = document.querySelectorAll('#form-fields [data-field]');
  const data = { state: selectedState.code };
  let hasError = false;

  fields.forEach(el => {
    const key = el.dataset.field;
    const val = el.value.trim();
    if (el.hasAttribute('required') && !val) {
      el.classList.add('error');
      hasError = true;
    } else {
      el.classList.remove('error');
    }
    if (val) data[key] = val;
  });

  if (hasError) {
    showToast('Please fill all required fields', 'error');
    if (tg && tg.HapticFeedback) {
      tg.HapticFeedback.notificationOccurred('error');
    }
    return;
  }

  // Send to bot
  if (tg) {
    tg.HapticFeedback.notificationOccurred('success');
    tg.MainButton.showProgress();
    try {
      tg.sendData(JSON.stringify(data));
    } catch (e) {
      showToast('Failed to send data', 'error');
      tg.MainButton.hideProgress();
    }
  } else {
    console.log('[TMA Mock] Form data:', JSON.stringify(data, null, 2));
    showToast('✅ Data logged to console (mock mode)', 'success');
  }
}

// ─── Toast Notification ─────────────────────────────────────────
function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.className = `toast ${type} show`;
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// ─── Event Listeners ────────────────────────────────────────────
function setupListeners() {
  // Search
  const searchInput = document.getElementById('search-states');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderStateGrid(e.target.value);
    });
  }

  // Form field change → update progress
  document.addEventListener('input', (e) => {
    if (e.target.closest('#form-fields')) {
      updateFormProgress();
    }
  });

  // Mode selector
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      formMode = btn.dataset.mode;
      if (tg && tg.HapticFeedback) tg.HapticFeedback.selectionChanged();
    });
  });

  // Telegram BackButton
  if (tg) {
    tg.BackButton.onClick(() => {
      if (currentView === 'form-view') {
        showView('states-view');
      } else if (currentView === 'states-view') {
        showView('dashboard');
      }
    });

    tg.MainButton.onClick(() => {
      submitForm();
    });
  }
}

// ─── Initialize ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initTelegram();
  renderDashboard();
  renderStateGrid();
  setupListeners();
  showView('dashboard');
});
